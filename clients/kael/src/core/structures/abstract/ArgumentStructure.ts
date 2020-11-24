import { mergeDefault } from '@packages/utils';

import defaultArgumentConfig from '@config/defaults/argument';

import {
  ArgumentOptions,
  CommandExecuteData,
  ArgumentExecuteData,
  ArgumentOptionsPartial,
  ArgumentStructure as IArgumentStructure,
} from '@interfaces';

abstract class ArgumentStructure<O = any> implements IArgumentStructure<O> {
  public readonly options: ArgumentOptions<O>;

  public abstract execute(
    argumentExecuteData: ArgumentExecuteData,
    commandExecuteData: CommandExecuteData,
  ): any;

  constructor(options: ArgumentOptionsPartial<O> = {}) {
    this.options = mergeDefault<ArgumentOptions<O>>(
      Object.assign(defaultArgumentConfig, this.defaultOptions),
      options,
    );

    Object.defineProperty(this, 'options', {
      writable: false,
      enumerable: false,
      value: this.options,
    });
  }

  get defaultOptions(): AllPartial<ArgumentOptions<O>> {
    const defaultOptions = {
      required: true,
      missingError: 'errors:missingGeneric',
    };

    // throw new Error('No inplemented "defaultOptions" getter.');
    return defaultOptions as AllPartial<ArgumentOptions<O>>;
  }
}

export default ArgumentStructure;
