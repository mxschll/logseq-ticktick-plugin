import '@logseq/libs';
import moment from 'moment';
import TickTick from './ticktick/ticktick';
import { NewTask, Subtask } from './ticktick/task';
import { logseq as PackageLogseq } from '../package.json';
import { settingsSchema, getTickTickSettings } from './settings';
import { BlockEntity } from '@logseq/libs/dist/LSPlugin';

const pluginId = PackageLogseq.id;
const ticktick = new TickTick();

const priorityToNum = (text: string): 0 | 1 | 3 | 5  => {
  const priority = text.match(/\[#([A-C])\]/);
  if (priority) {
    switch (priority[1]) {
      case 'A':
        return 5;
      case 'B':
        return 3;
      case 'C':
        return 1;
    }
  }
  return 0;
};

const priorityToTag = (priority: 0 | 1 | 3 | 5 | undefined): string => {
  switch (priority) {
    case 5:
      return ' [#A] ';
    case 3:
      return ' [#B] ';
    case 1:
      return ' [#C] ';
  }
  return '';
};

const parseTask = (text: string): NewTask => {
  // parse priority and remove it from the title
  const priority = priorityToNum(text);
  let title = text.replace(/\[#([A-C])\]/, '');
  title = title.replace(/TODO/, '');

  return {
    title,
    priority,
    items: [],
  };
};

const getTreeContent: (block: BlockEntity) => Promise<BlockEntity | null> = async (block) => {
  const blockEntity = await logseq.Editor.getBlock(block.uuid, { includeChildren: true });

  return blockEntity;
}

const flattenTree: (node: BlockEntity) => BlockEntity[] = (node) => {
  const result: BlockEntity[] = [node];

  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenTree(child as BlockEntity));
    }
  }

  return result;
}

const main: () => Promise<void> = async () => {
  console.info(`#${pluginId}: MAIN`);

  logseq.useSettingsSchema(settingsSchema);
  let settings = getTickTickSettings();
  
  logseq.onSettingsChanged(() => {
    settings = getTickTickSettings();

    if (
      settings.accessToken === '' &&
      settings.accessCode !== '' &&
      settings.clientId !== '' &&
      settings.clientSecret !== '' &&
      settings.redirectUri !== ''
    ) {
      ticktick
        .getAccessToken(
          settings.clientId,
          settings.clientSecret,
          settings.accessCode,
          settings.redirectUri,
        )
        .then((accessToken) => {
          logseq.updateSettings({ accessToken });
          logseq.UI.showMsg(
            'TickTick access token updated successfully.',
            'success',
          );
        });
    }
  });

  if (settings.accessToken !== '') {
    ticktick.setAccessToken(settings.accessToken);
  }

  logseq.Editor.registerSlashCommand('tt', async () => {
    const blockEntity = await logseq.Editor.getCurrentBlock();
    if (!blockEntity) {
      console.error('No block selected');
      return;
    }

    let contentTree = await getTreeContent(blockEntity);
    if (!contentTree) {
      console.error('Cannot get tree content from block entity');
      return;
    }

    const flatContentTree = flattenTree(contentTree);
    console.log(flatContentTree);

    const subtasks: Subtask[] = flatContentTree.slice(1).map(child => {
      const subtask: Subtask = {
        title: child.content.replace(/TODO/, '').replace(/\[#([A-C])\]/, ''),
      };
      return subtask;
    });

    const task = parseTask(flatContentTree[0]?.content || '');
    task.items = subtasks; 

    try {
      const newTask = await ticktick.createTask(task);
      await logseq.Editor.updateBlock(
        blockEntity.uuid,
        `TODO${priorityToTag(newTask.priority)}[${newTask.title}](${newTask.taskUrl})`,
      );
    } catch (error) {
      logseq.UI.showMsg('TickTick access token is invalid.', 'error');
    }
  });
}

logseq.ready(main).catch(console.error);