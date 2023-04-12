import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

export const settingsSchema: SettingSchemaDesc[] = [
  {
    key: 'access_token',
    type: 'string',
    title: 'TickTick Access Token',
    description: 'Your can get your access token from https://mxschll.github.io/logseq-ticktick-plugin',
    default: '',
  },
];

export const getTickTickSettings = () => {
  const accessToken = logseq.settings!['access_token'];

  return {
    accessToken: accessToken || '',
  };
};
