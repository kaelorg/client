import { eachSeries } from 'async';
import { GuildMember, PermissionString } from 'discord.js';

import SendedError from '@core/errors/SendedError';

import { Command, CommandExecuteData, Service } from '@interfaces';

class CommandHandleToolsService implements Service {
  public async execute({ command, commandExecuteData }: Data) {
    const { t, guild, member } = commandExecuteData;
    const {
      guildOnly,
      botPermissions,
      userPermissions,
    } = command.options.tools;

    if (guildOnly && !guild) {
      throw new SendedError(t('errors:guildOnly'));
    }

    if (!guild) return;

    const permissionResolve: PermissionResolveData[] = [
      ['ClientPermissions', botPermissions, guild.me as GuildMember],
      ['UserPermissions', userPermissions, member as GuildMember],
    ];

    await eachSeries(
      permissionResolve,
      async ([translate, permissions, guildMember]: PermissionResolveData) => {
        const memberPermissions = guildMember.permissions;

        if (
          permissions.every(permission => memberPermissions.has(permission))
        ) {
          return;
        }

        const notHavePermissions = permissions.filter(
          permission => !memberPermissions.has(permission),
        );

        throw new SendedError(
          t(
            `errors:missing${
              notHavePermissions.length > 1 ? 'Multiple' : ''
            }${translate}`,
            {
              permission: notHavePermissions
                .map(permission => t(`commons:permissions.${permission}`))
                .join(', '),
            },
          ),
        );
      },
    );
  }
}

type PermissionResolveData = [string, PermissionString[], GuildMember];

interface Data {
  command: Command;
  commandExecuteData: CommandExecuteData;
}

export default CommandHandleToolsService;
