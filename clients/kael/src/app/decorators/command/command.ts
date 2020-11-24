import { Command, CommandOptionsPartial } from '@interfaces';

function command(options: CommandOptionsPartial) {
  return function myCommand<T extends Command>(
    commandConstructable: CommandConstructable<T>,
  ): Constructable<T> {
    Reflect.defineProperty(commandConstructable.prototype, 'options', {
      value: options,
      writable: true,
    });

    return commandConstructable;
  };
}

type CommandConstructable<T extends Command> = {
  new (...args: any[]): T;
};

export default command;
