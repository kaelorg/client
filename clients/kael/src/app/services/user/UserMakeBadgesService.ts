import { Roles, Guilds, Badges } from '@kaelbot/constants';
import { User } from 'discord.js';

import hasRoles from '@utils/permission/hasRoles';

import { Service } from '@interfaces';
import { UserBadges, UserRoleBadge } from '@interfaces/dtos/services/user';

class UserMakeBadgesService implements Service {
  public async execute(user: User): Promise<UserBadges> {
    const [
      isDesign,
      isHelper,
      isPartner,
      isSupport,
      isBugHunter,
      isDeveloper,
      isCoordinator,
      isCollaborator,
    ] = await hasRoles(user.id, {
      guilds: [Guilds.Official, Guilds.Developer],
      roles: [
        Roles.Design,
        Roles.Helper,
        Roles.Partner,
        Roles.Support,
        Roles.BugHunter,
        Roles.Developer,
        Roles.Coordinator,
        Roles.Collaborator,
      ],
    });

    const roles: UserRoleBadge[] = [];

    if (isDesign) roles.push([Badges.Roles.Design, 40, 40]);
    if (isHelper) roles.push([Badges.Roles.Helper, 40, 40]);
    if (isPartner) roles.push([Badges.Roles.Partner, 40, 40]);
    if (isSupport) roles.push([Badges.Roles.Support, 40, 40]);
    if (isBugHunter) roles.push([Badges.Roles.BugHunter, 40, 40]);
    if (isDeveloper) roles.push([Badges.Roles.Developer, 40, 40]);
    if (isCoordinator) roles.push([Badges.Roles.Coordinator, 40, 40]);
    if (isCollaborator) roles.push([Badges.Roles.Collaborator, 40, 40]);

    return {
      roles,
    };
  }
}

export default UserMakeBadgesService;
