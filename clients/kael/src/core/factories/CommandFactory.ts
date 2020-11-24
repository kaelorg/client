import { inject, injectable } from 'tsyringe';

import { Namespace } from '@config/containers';

import { Command, CommandCache } from '@interfaces';

@injectable()
class CommandFactory {
  constructor(
    @inject(Namespace.CommandCache)
    private commandCache: CommandCache,
  ) {}

  public getCommand(search: string): Command | undefined {
    const { cache } = this.commandCache;

    if (cache.has(search)) {
      return cache.get(search);
    }

    const commands = cache.array();
    const command = commands.find(({ aliases }) => aliases.has(search));

    return command;
  }
}

export default CommandFactory;
