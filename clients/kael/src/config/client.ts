import { Urls } from '@kaelbot/constants';
import { ClientOptions } from 'discord.js';

const messageCacheLifetimeMinutes = 10;
const messageCacheLifetime = 60000 * messageCacheLifetimeMinutes;

const config: ClientOptions = {
  messageCacheLifetime,

  shards: 'auto',

  retryLimit: 3,
  messageCacheMaxSize: 50,
  fetchAllMembers: false,

  presence: {
    status: 'online',
    activity: {
      name: Urls.Site,
      type: 0,
    },
  },
};

export default config;
