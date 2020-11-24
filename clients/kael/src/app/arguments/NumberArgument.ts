import ArgumentError from '@core/errors/ArgumentError';
import ArgumentStructure from '@core/structures/abstract/ArgumentStructure';

import {
  ArgumentOptions,
  CommandExecuteData,
  ArgumentExecuteData,
} from '@interfaces';

const numberRegex = /^[+-]?([0-9]*[.])?[0-9]+$/;

class NumberArgument extends ArgumentStructure<Options> {
  get defaultOptions(): AllPartial<ArgumentOptions<Options>> {
    return {
      missingError: 'errors:missingNumber',
      acceptNotInteger: true,
    };
  }

  public execute(
    { argument }: ArgumentExecuteData,
    { t, document }: CommandExecuteData,
  ): number {
    const number = Number(argument.replace(/%/g, ''));

    if (
      isNaN(number) ||
      number === null ||
      typeof number === 'undefined' ||
      !numberRegex.test(number as any)
    ) {
      throw new ArgumentError(t('errors:missingValidNumber'));
    }

    const { min, max, acceptNotInteger } = this.options;

    if (!acceptNotInteger && !Number.isInteger(number)) {
      throw new ArgumentError(t('errors:someAcceptIntegerNumber'));
    }

    if (min && number < min) {
      throw new ArgumentError(
        t('errors:missingBiggerNumber', {
          number: Number(min).toLocaleString(document.language),
        }),
      );
    }

    if (max && number > max) {
      throw new ArgumentError(
        t('errors:missingSmallerNumber', {
          number: Number(max).toLocaleString(document.language),
        }),
      );
    }

    return number;
  }
}

interface Options {
  min: number;
  max: number;
  acceptNotInteger: boolean;
}

export default NumberArgument;
