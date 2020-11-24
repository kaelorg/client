import { GuildUserVanity } from '@kaelbot/database';
import APIWebSocket from '@packages/api-websocket';
import { GuildMember } from 'discord.js';
import moment from 'moment';
import { inject, injectable } from 'tsyringe';

import MemberArgument from '@app/arguments/MemberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'add',
  category: 'vanity',
  reference: 'vanity',
  aliases: ['adicionar'],
  arguments: [new MemberArgument({ acceptSelf: false, acceptBot: false })],
})
class AddVanityCommand extends CommandStructure {
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
      channel.error(author, t('commands:vanity.add.noVip'));
      return;
    }

    if (
      vanityUsers.filter(({ added_by }) => added_by === author.id).length >= 10
    ) {
      channel.error(author, t('commands:vanity.add.alreadyGive'));
      return;
    }

    if (vanityUsers.some(({ id }) => id === member.id)) {
      channel.error(author, t('commands:vanity.add.userAlreadyVip'));
      return;
    }

    const vanitySocket = this.apiWebSocket.subscriptions.get('vanity');
    const { role, time, timestamp } = vanityUsers.find(
      user => user.id === author.id,
    ) as GuildUserVanity;

    channel
      .send(
        this.embed(author)
          .setTitle(t('commands:vanity.add.title'))
          .setThumbnail(member.user.displayAvatarURL())
          .setAuthor(t('commands:vanity.author'), guild.iconURL() || undefined)
          .addField(t('commands:vanity.add.by'), author.toString())
          .addField(t('commands:vanity.add.receivedBy'), member.toString())
          .addField(t('commands:vanity.add.role'), `<@&${role}>`)
          .addField(
            t('commands:vanity.add.timeLeft'),
            moment
              .duration(time - (Date.now() - timestamp))
              .format('M[m] d[d] h[h] m[m] s[s]'),
          ),
      )
      .then(() => {
        vanitySocket.send('add', {
          time,
          timestamp,
          role_id: role,
          guild_id: guild.id,
          added_by: author.id,
          member_id: member.id,
        });
      });
  }
}

export default AddVanityCommand;
