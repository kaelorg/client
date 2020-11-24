import { isObject } from '@packages/utils';
import {
  Guild,
  GuildMember,
  GuildChannel,
  TextChannel,
  MessageEmbed,
} from 'discord.js';

class MessageHelper {
  ['constructor']: typeof MessageHelper;

  public async handle(
    message: string,
    { guild, member, channel }: HandleDeps,
  ): Promise<void> {
    const parsedMessage = MessageHelper.parse(message, { guild, member });

    if (channel instanceof TextChannel) {
      await channel.send(parsedMessage).catch(() => {
        // void
      });
    }
  }

  // Static

  public static parse(
    message: string,
    { guild, member }: ParseDeps,
  ): string | MessageEmbed {
    const replacedMessage = message
      .replace(/\[server\]/, guild.name)
      .replace(/\[user-id\]/, member.id)
      .replace(/\[mention\]/, member.toString)
      .replace(/\[user\]/, (member.user || member).tag);

    try {
      const jsonMessage = JSON.parse(
        JSON.stringify(replacedMessage)
          .replace(/\\/g, '')
          .replace(/"{/, '{')
          .replace(/}"/, '}'),
      );

      if (isObject(jsonMessage)) {
        return new MessageEmbed(jsonMessage);
      }
    } catch {
      // Silent
    }

    return replacedMessage;
  }
}

interface HandleDeps {
  guild: Guild;
  member: GuildMember;
  channel: GuildChannel;
}

interface ParseDeps {
  guild: Guild;
  member: GuildMember;
}

export default MessageHelper;
