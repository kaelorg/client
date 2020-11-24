import { Command } from '../../../src/interfaces';

function error(command: Command | undefined): Error | undefined {
  if (!command) {
    return undefined;
  }

  return new Error(
    `O comando "${command.name}" possui o nome ou alguma aliase duplicada.`,
  );
}

export default error;
