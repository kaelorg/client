import { GuildDocument, DocumentResponse } from '@kaelbot/database';
import { Message, ClientUser } from 'discord.js';
import { container, inject, injectable } from 'tsyringe';

import listener from '@app/decorators/event/listener';
import CommandExecuteService from '@app/services/command/CommandExecuteService';
import CommandFactory from '@core/factories/CommandFactory';
import EventStructure from '@core/structures/abstract/EventStructure';

import { Namespace } from '@config/containers';

import { Client } from '@interfaces';

@injectable()
class MessageEvent extends EventStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  @listener('message')
  protected async onMessage(message: Message): Promise<void> {
    const { database } = this.client;
    const { content, author, guild } = message;

    if (author.bot) {
      return;
    }

    let document: DocumentResponse<GuildDocument> =
      database.guilds.defaultValue;

    if (guild) {
      document = await database.retrieveConnection('guild', guild.id);
    }

    const clientId = (this.client.user as ClientUser).id;

    const prefixes = [document.prefix, `<@!${clientId}>`, `<@${clientId}>`];
    const usedPrefix = prefixes.find(myPrefix => content.startsWith(myPrefix));

    if (!usedPrefix || content.length <= usedPrefix.length) {
      return;
    }

    const fullCmd = content
      .substring(usedPrefix.length)
      .split(/[ \t]+/)
      .filter(arg => arg)
      .map(arg => arg.trim());

    const args = fullCmd.slice(1);
    const search = fullCmd[0].toLowerCase();

    const commandFactory = container.resolve(CommandFactory);
    const command = commandFactory.getCommand(search);

    if (!command) return;

    const commandExecute = container.resolve(CommandExecuteService);

    await commandExecute.execute({ args, command, message, document });
  }
}

export default MessageEvent;
