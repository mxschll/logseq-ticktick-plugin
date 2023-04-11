import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

export const settingsSchema: SettingSchemaDesc[] = [
  {
    key: 'client_id',
    type: 'string',
    title: 'TickTick Client ID',
    description: 'TickTick Client ID',
    default: '',
  },
  {
    key: 'client_secret',
    type: 'string',
    title: 'TickTick Client Secret',
    description: 'TickTick Client Secret',
    default: '',
  },
  {
    key: 'redirect_uri',
    type: 'string',
    title: 'TickTick Redirect URI',
    description: 'TickTick Redirect URI',
    default: 'https://mxschll.github.io/logseq-ticktick-plugin',
  },
  {
    key: 'access_code',
    type: 'string',
    title: 'TickTick Access Code',
    description: 'TickTick Code',
    default: '',
  },
];

export const getTickTickSettings = () => {
  const clientId = logseq.settings!['client_id'];
  const clientSecret = logseq.settings!['client_secret'];
  const redirectUri = logseq.settings!['redirect_uri'];
  const accessCode = logseq.settings!['access_code'];
  const accessToken = logseq.settings!['access_token'];

  return {
    clientId: clientId || '',
    clientSecret: clientSecret || '',
    redirectUri: redirectUri || '',
    accessCode: accessCode || '',
    accessToken: accessToken || '',
  };
};
