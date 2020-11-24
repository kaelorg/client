import ArgumentError from '@core/errors/ArgumentError';
import ArgumentStructure from '@core/structures/abstract/ArgumentStructure';

import {
  ArgumentOptions,
  CommandExecuteData,
  ArgumentExecuteData,
} from '@interfaces';

class StringArgument extends ArgumentStructure<Options> {
  get defaultOptions(): AllPartial<ArgumentOptions<Options>> {
    return {
      missingError: 'errors:missingString',
      truncate: false,
      removeSpaces: false,
      maxLength: 0,
    };
  }

  public execute(
    { fullArgument }: ArgumentExecuteData,
    { t }: CommandExecuteData,
  ): string {
    let string = fullArgument;
    const { removeSpaces, maxLength, truncate } = this.options;

    if (removeSpaces) string = string.replace(/ +/g, '');
    if (maxLength && maxLength > 0 && string.length > maxLength) {
      if (!truncate) {
        throw new ArgumentError(
          t('errors:needSmallerString', { length: maxLength }),
        );
      }

      string = string.substring(0, maxLength);
    }

    return string;
  }
}

interface Options {
  truncate: boolean;
  removeSpaces: boolean;
  maxLength: number;
}

export default StringArgument;
