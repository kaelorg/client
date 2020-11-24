import { mergeDefault } from '@packages/utils';

import { Service, Command } from '@interfaces';

class CommandGetIdentifierService implements Service {
  public execute({ args, command }: Data): CommandIdentifier {
    const { command: myCommand, args: myArgs } = args.reduce(
      (currentData, currentSearch) => {
        const {
          indexed,
          args: currentArgs,
          command: currentCommand,
        } = currentData;

        if (!indexed) {
          return currentData;
        }

        const searchLowerCase = currentSearch.toLowerCase();
        const gettedCommand = currentCommand.subcommands.find(
          ({ name, aliases }) =>
            name === searchLowerCase || aliases.has(searchLowerCase),
        );

        if (gettedCommand) {
          return mergeDefault(currentData, {
            command: gettedCommand,
            args: currentArgs.slice(1),
          });
        }

        return mergeDefault(currentData, { indexed: false });
      },
      {
        args,
        command,
        indexed: true,
      },
    );

    return {
      args: myArgs,
      command: myCommand,
    };
  }
}

interface Data {
  args: string[];
  command: Command;
}

interface CommandIdentifier {
  args: string[];
  command: Command;
}

export default CommandGetIdentifierService;
