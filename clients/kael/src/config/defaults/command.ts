import { CommandOptions } from '@interfaces';

const config: Omit<CommandOptions, 'name'> = {
  category: 'general',
  hidden: false,
  aliases: [],
  arguments: [],
  tools: {
    devOnly: false,
    guildOnly: false,
    botPermissions: [],
    userPermissions: [],
  },
};

export default config;
