import { cloneObject } from '@packages/utils';
import { Collection } from 'discord.js';
import { container } from 'tsyringe';

import CommandUtil from '@utils/command/CommandUtil';

import { Command, CommandCache as ICommandCache } from '@interfaces';

class CommandCache implements ICommandCache {
  private readonly subcommands: Command[] = [];

  public readonly cache = new Collection<string, Command>();

  public load(CommandConstructable: Constructable<Command>): void {
    const commandUtil = new CommandUtil();
    const command = container.resolve(CommandConstructable);

    if (commandUtil.isSubcommand(command)) {
      this.subcommands.push(command);
    } else {
      this.cache.set(command.name, command);
    }
  }

  public sweepSubCommands(): void {
    const { subcommands } = this;

    if (!subcommands.length) return;

    const commandUtil = new CommandUtil();
    const allCommands = this.cache.array().concat(subcommands);

    while (subcommands.length) {
      const subcommand = subcommands.shift() as Command;
      const references = commandUtil.getReferences(subcommand);

      for (const commandReference of references) {
        const command = this.getCommandByReference(
          commandReference,
          allCommands,
        );

        if (command) {
          /**
           * Cloned Command object.
           * - Not have conflict if have multiple references.
           */
          const subcommandCloned = cloneObject(subcommand);

          command.subcommands.push(subcommandCloned.setParent(command));
        }
      }
    }
  }

  // Private

  private getCommandByReference(
    reference: string,
    commands = this.cache.array(),
  ): Command | undefined {
    if (/\./.test(reference)) {
      return undefined;
    }

    return commands.find(({ name }) => name === reference);
  }
}

export default CommandCache;
