import { Urls } from '@kaelbot/constants';

const config = {
  path: '/ws',
  reconnectionTimeout: 5000,
  maxConnectionAttempts: Infinity,
  url:
    process.env.NODE_ENV === 'production'
      ? Urls.Gateway
      : process.env.GATEWAY_URL || 'ws://localhost:2000',
};

export default config;
