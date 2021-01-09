import {
  User,
  Guild,
  Message,
  Structures,
  GuildChannel,
  TextBasedChannelFields,
} from 'discord.js';

import { extendAll } from '@utils/extend';

import {
  ChannelExtendedErrorContentOptions,
  ChannelExtendedStructure as IChannelExtendedStructure,
} from '@interfaces';

import ClientEmbedStructure from '../ClientEmbedStructure';

class ChannelExtendedStructure
  implements Pick<IChannelExtendedStructure, 'error' | 'send'> {
  public type!: keyof typeof ChannelType;

  public guild!: Guild;

  public send!: TextBasedChannelFields['send'];

  public permissionsFor!: GuildChannel['permissionsFor'];

  get canSendMessages(): boolean {
    if (this.type === 'dm') {
      return true;
    }

    if (['text', 'news'].includes(this.type)) {
      return !!(
        this.guild.me &&
        this.permissionsFor(this.guild.me)?.has('SEND_MESSAGES')
      );
    }

    return false;
  }

  public error(
    author: User,
    content: string | ChannelExtendedErrorContentOptions,
  ): Promise<Message> | undefined {
    if (!content) return;

    const embed = new ClientEmbedStructure()
      .error()
      .setUser(author)
      .setTitle('Poing-oing...');

    if (typeof content === 'string') {
      embed.setDescription(content);
    } else if (content instanceof Object) {
      embed.setTitle(content.title).setDescription(content.description);
    }

    return this.send(embed);
  }
}

Structures.extend('TextChannel', TextChannel =>
  extendAll(TextChannel, ChannelExtendedStructure),
);

// Required, as it does not extend the "TextChannel" class.
Structures.extend('DMChannel', DMChannel =>
  extendAll(DMChannel, ChannelExtendedStructure),
);
