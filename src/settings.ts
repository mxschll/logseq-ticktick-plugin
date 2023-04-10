import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

export const settingsSchema: SettingSchemaDesc[] = [
  {
    key: 'ticktick.client_id',
    type: 'string',
    title: 'Client ID',
    description: 'TickTick Client ID',
    default: '',
  },
  {
    key: 'ticktick.client_secret',
    type: 'string',
    title: 'Client Secret',
    description: 'TickTick Client Secret',
    default: '',
  },
  {
    key: 'ticktick.redirect_uri',
    type: 'string',
    title: 'Redirect URI',
    description: 'TickTick Redirect URI',
    default: '',
  },
  {
    key: 'ticktick.code',
    type: 'string',
    title: 'Code',
    description: 'TickTick Code',
    default: 'https://mxschll.github.io/logseq-ticktick-plugin',
  },
];

export const getTickTickSettings = () => {
  const clientId = logseq.settings!['ticktick.client_id'];
  const clientSecret = logseq.settings!['ticktick.client_secret'];
  const redirectUri = logseq.settings!['ticktick.redirect_uri'];
  const code = logseq.settings!['ticktick.code'];
  const accessToken = logseq.settings!['ticktick.access_token'] || '';
  return {
    clientId,
    clientSecret,
    redirectUri,
    code,
    accessToken,
  };
};
