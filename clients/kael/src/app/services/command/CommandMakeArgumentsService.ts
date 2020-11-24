import { mapSeries } from 'async';

import SendedError from '@core/errors/SendedError';
import ArgumentExecuteDataStructure from '@core/structures/ArgumentExecuteDataStructure';

import { Service, Argument, CommandExecuteData } from '@interfaces';

class CommandMakeArgumentsService implements Service {
  public async execute({
    args,
    commandExecuteData,
    arguments: commandArguments,
  }: Data): Promise<any[]> {
    return mapSeries<Argument, any>(commandArguments, async argument => {
      const index = commandArguments.indexOf(argument);
      const currentArgument = args[index];
      const { required, missingError } = argument.options;

      if (!currentArgument && required) {
        throw new SendedError(commandExecuteData.t(missingError));
      }

      if (!currentArgument) return;
      return argument.execute(
        new ArgumentExecuteDataStructure({ args: args.slice(index) }),
        commandExecuteData,
      );
    });
  }
}

interface Data {
  args: string[];
  arguments: Argument[];
  commandExecuteData: CommandExecuteData;
}

export default CommandMakeArgumentsService;
