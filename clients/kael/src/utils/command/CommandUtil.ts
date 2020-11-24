import { Command } from '@interfaces';

class CommandUtil {
  public isSubcommand(command: Command): boolean {
    const { reference } = command.options;

    return typeof reference === 'string' || Array.isArray(reference);
  }

  public getReferences(command: Command): string[] {
    const { reference } = command.options;

    if (!reference) return [];
    return Array.isArray(reference) ? reference : [reference];
  }
}

export default CommandUtil;
