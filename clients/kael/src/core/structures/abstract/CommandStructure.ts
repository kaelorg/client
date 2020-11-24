import { mergeDefault } from '@packages/utils';
import { User, MessageEmbedOptions } from 'discord.js';

import defaultCommandConfig from '@config/defaults/command';

import {
  Command,
  CommandOptions,
  CommandExecuteData,
  CommandOptionsPartial,
  CommandStructure as ICommandStructure,
} from '@interfaces';

import ClientEmbedStructure from '../ClientEmbedStructure';

abstract class CommandStructure implements ICommandStructure {
  public readonly name!: string;

  public readonly aliases = new Set<string>();

  public readonly options!: CommandOptions;

  public readonly subcommands: Command[] = [];

  public parent?: Command;

  public abstract execute(
    commandExecuteData: CommandExecuteData,
    ...params: any[]
  ): any;

  constructor() {
    const mainOptions = this.options as CommandOptionsPartial;
    const { name } = mainOptions;

    this.name = name;

    /**
     * Command options merged with default values.
     */
    const options = mergeDefault<CommandOptions>(
      Object.assign(defaultCommandConfig, { name }),
      mainOptions,
    );

    for (const aliase of options.aliases) {
      this.aliases.add(aliase);
    }

    Object.defineProperty(this, 'options', {
      writable: false,
      enumerable: false,
      value: options,
    });
  }

  public setParent(command: Command): this {
    this.parent = command;
    return this;
  }

  //

  protected embed(
    user: User,
    options: MessageEmbedOptions = {},
  ): ClientEmbedStructure {
    return new ClientEmbedStructure(options).setUser(user);
  }
}

export default CommandStructure;
