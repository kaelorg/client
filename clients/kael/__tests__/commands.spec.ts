import { container } from 'tsyringe';

import { Namespace } from '../src/config/containers';
import { Command, CommandCache } from '../src/interfaces';
import commandsLoader from '../src/start/loaders/commandsLoader';
import { after, before } from './config/makes';
import error from './utils/command/error';
import find from './utils/command/find';

const commands: Command[] = [];

afterAll(() => after());

beforeAll(async () => {
  before();
  commandsLoader();

  const cachedCommands = container
    .resolve<CommandCache>(Namespace.CommandCache)
    .cache.array();

  commands.push(...cachedCommands);
});

describe('Commands', () => {
  test('commands cannot have duplicate names or aliases', done => {
    const command = commands.find(find);

    done(error(command));
  });

  test('subcommands cannot have duplicate names or aliases', done => {
    const subcommands: Command[] = [];

    function getSubcommands(command: Command): void {
      const { subcommands: commandSubcommands } = command;

      if (!subcommands.length) {
        return;
      }

      subcommands.push(...commandSubcommands);

      for (const subcommand of commandSubcommands) {
        getSubcommands(subcommand);
      }
    }

    for (const command of commands) {
      getSubcommands(command);
    }

    const subcommand = subcommands.find(find);

    done(error(subcommand));
  });
});
