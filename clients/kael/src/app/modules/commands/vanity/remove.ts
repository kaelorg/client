import APIWebSocket from '@packages/api-websocket';
import { GuildMember } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import MemberArgument from '@app/arguments/MemberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'remove',
  category: 'vanity',
  reference: 'vanity',
  aliases: ['adicionar'],
  arguments: [new MemberArgument({ acceptSelf: false, acceptBot: false })],
})
class RemoveVanityCommand extends CommandStructure {
  constructor(
    @inject(Namespace.APIWebSocket)
    private apiWebSocket: APIWebSocket,
  ) {
    super();
  }

  public execute(
    { t, document, author, channel, guild }: CommandExecuteData,
    member: GuildMember,
  ) {
    const vanityUsers = document.vanity.users;

    if (!vanityUsers.some(({ id }) => id === author.id)) {
      channel.error(author, t('commands:vanity.remove.noVip'));
      return;
    }

    if (!vanityUsers.some(({ id }) => id === member.id)) {
      channel.error(author, t('commands:vanity.remove.noUserVip'));
      return;
    }

    if (
      !vanityUsers.some(
        user => user.id === member.id && user.added_by === author.id,
      )
    ) {
      channel.error(author, t('commands:vanity.remove.noAddedUserVip'));
      return;
    }

    const vanitySocket = this.apiWebSocket.subscriptions.get('vanity');

    channel
      .send(
        this.embed(author)
          .setTitle(t('commands:vanity.remove.title'))
          .setThumbnail(member.user.displayAvatarURL())
          .setAuthor(t('commands:vanity.author'), guild.iconURL() || undefined)
          .setDescription(
            t('commands:vanity.remove.description', {
              member: member.toString(),
            }),
          ),
      )
      .then(() => {
        vanitySocket.send('remove', {
          guild_id: guild.id,
          member_id: member.id,
        });
      });
  }
}

export default RemoveVanityCommand;
