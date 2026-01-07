export default {
  module: 'GatewayServer',
  CAPTCHA: '0',
  FAKE_PLAYERS: 0,
  HWID_LIMIT: 4,
  LOCAL: {
    HOST: '127.0.0.1',
    PORT: 9007
  },
  REMOTE: {
    HOST: '54.37.80.146',
    PORT: 9001
  },
  REDIRECT: {
    AgentServer: {
      HOST: '54.37.80.146',
      PORT: 9003
    },
    DownloadServer: {
      HOST: '54.37.80.146',
      PORT: 9002
    },
  },
  whitelist: {
    0x2002: 'GLOBAL_PING',
    0x9000: 'GLOBAL_HANDSHAKE_ACCEPT',
    0x6100: 'PATCH_REQUEST',
    0x6101: 'SHARD_LIST_REQUEST',
    0x6102: 'LOGIN_REQUEST',
    0x6104: 'NOTICE_REQUEST',
    0x6106: 'SHARD_LIST_PING_REQUEST',
    0xCAFE: 'HWID_REGISTRATION'
  }
};
