import { resolve } from 'path';

import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Command } from '@interfaces';

import readFolder from './readFolder';

function readCommands(): Constructable<Command>[] {
  return readFolder<Constructable<Command>>(
    resolve(__dirname, '..', '..', 'app', 'modules', 'commands'),
    command => Object.getPrototypeOf(command) === CommandStructure,
  );
}

export default readCommands;
