import logger from '@packages/logger';
import { container } from 'tsyringe';

import { Namespace } from '@config/containers';

import { CommandCache } from '@interfaces';

import readCommands from '../utils/readCommands';

/**
 * Loads the commands and register in the cache.
 */
function commandsLoader(): void {
  const commands = readCommands();
  const commandCache = container.resolve<CommandCache>(Namespace.CommandCache);

  for (const command of commands) {
    commandCache.load(command);
  }

  // Analyze and load all subcommands
  commandCache.sweepSubCommands();

  logger.info('All commands and subcommands was loaded.', {
    label: 'commands-loader',
  });
}

export default commandsLoader;
