import { Collection } from 'discord.js';

import { Command } from '../structures/abstract/command';

export interface CommandCache {
  cache: Collection<string, Command>;
  sweepSubCommands(): void;
  load(CommandConstructable: Constructable<Command>): void;
}
