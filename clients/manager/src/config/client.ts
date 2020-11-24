import { ClientOptions } from 'discord.js';

const config: ClientOptions = {
  shards: 'auto',
  retryLimit: 6,
  restTimeOffset: 5000,
  messageCacheMaxSize: 50,
  restSweepInterval: 60000,
  restRequestTimeout: 30000,
  fetchAllMembers: false,
};

export default config;
