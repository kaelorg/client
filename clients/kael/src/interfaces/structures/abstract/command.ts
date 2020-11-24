/* eslint-disable @typescript-eslint/no-empty-interface */

import { PermissionString } from 'discord.js';

import { CommandExecuteData } from '../commandExecuteData';
import { Argument } from './argument';

export interface Command extends CommandStructure {}

export interface CommandStructure {
  name: string;
  parent?: Command;
  aliases: Set<string>;
  subcommands: Command[];
  options: CommandOptions;
  setParent(command: Command): this;
  execute(commandExecuteData: CommandExecuteData, ...params: any[]): any;
}

// Options

export interface CommandOptionsPartial
  extends AllPartial<Omit<CommandOptions, 'name'>> {
  name: CommandOptions['name'];
}

export interface CommandOptions {
  name: string;
  hidden: boolean;
  category: string;
  aliases: string[];
  reference?: string | string[];
  arguments: Argument[];
  tools: {
    devOnly: boolean;
    guildOnly: boolean;
    botPermissions: PermissionString[];
    userPermissions: PermissionString[];
  };
}
