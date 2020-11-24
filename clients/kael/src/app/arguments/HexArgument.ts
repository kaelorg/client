import ArgumentError from '@core/errors/ArgumentError';
import ArgumentStructure from '@core/structures/abstract/ArgumentStructure';

import {
  ArgumentOptions,
  CommandExecuteData,
  ArgumentExecuteData,
} from '@interfaces';

class HexArgument extends ArgumentStructure {
  get defaultOptions(): AllPartial<ArgumentOptions> {
    return {
      missingError: 'errors:missingHex',
    };
  }

  public execute(
    { argument }: ArgumentExecuteData,
    { t }: CommandExecuteData,
  ): string {
    if (!/^#([a-fA-F0-9]{3}){1,2}$/.test(argument)) {
      throw new ArgumentError(t('errors:missingValidHex'));
    }

    return argument;
  }
}

export default HexArgument;
