import { GuildDocument, DocumentResponse } from '@kaelbot/database';
import { captureException } from '@sentry/node';
import { Message } from 'discord.js';

import SendedError from '@core/errors/SendedError';
import ClientEmbedStructure from '@core/structures/ClientEmbedStructure';
import CommandExecuteDataStructure from '@core/structures/CommandExecuteDataStructure';

import debug from '@utils/debug';

import { Service, Command } from '@interfaces';

import CommandGetIdentifierService from './CommandGetIdentifierService';
import CommandHandleToolsService from './CommandHandleToolsService';
import CommandMakeArgumentsService from './CommandMakeArgumentsService';

class CommandExecuteService implements Service {
  public async execute(data: Data): Promise<void> {
    const { args, command } = data;

    const commandExecuteData = new CommandExecuteDataStructure(data);

    const commandHandleTools = new CommandHandleToolsService();
    const commandMakeArguments = new CommandMakeArgumentsService();
    const commandGetIdentifier = new CommandGetIdentifierService();

    try {
      const {
        args: myArgs,
        command: myCommand,
      } = commandGetIdentifier.execute({ args, command });

      // Checks whether tools have been followed correctly
      await commandHandleTools.execute({ command, commandExecuteData });

      const commandArguments = await commandMakeArguments.execute({
        args: myArgs,
        commandExecuteData,
        arguments: myCommand.options.arguments,
      });

      // Run the command
      await myCommand.execute(commandExecuteData, ...commandArguments);
    } catch (error) {
      if (error instanceof SendedError) {
        const { author, channel } = commandExecuteData;
        const message = new ClientEmbedStructure({ title: error.message })
          .setUser(author)
          .error();

        await channel.send(message).catch(() => {});
        return;
      }

      captureException(error);
      debug('command:error', error.message || error);
    }
  }
}

interface Data {
  args: string[];
  message: Message;
  command: Command;
  document: DocumentResponse<GuildDocument>;
}

export default CommandExecuteService;
