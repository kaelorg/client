import { Urls } from '@kaelbot/constants';
import { PresenceData } from 'discord.js';

function makePresence(shardId: number, shardsSize: number): PresenceData {
  return {
    status: 'online',
    activity: {
      type: 0,
      name: `${Urls.Site} | (${shardId}/${shardsSize})`,
    },
  };
}

export default makePresence;
