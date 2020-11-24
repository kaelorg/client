/* eslint-disable @typescript-eslint/no-empty-interface */

import { ArgumentExecuteData } from '../argumentExecuteData';
import { CommandExecuteData } from '../commandExecuteData';

export interface Argument extends ArgumentStructure {}

export interface ArgumentStructure<O = any> {
  options: ArgumentOptions<O>;
  defaultOptions: AllPartial<ArgumentOptions<O>>;
  execute(
    argumentExecuteData: ArgumentExecuteData,
    commandExecuteData: CommandExecuteData,
  ): any;
}

// Options

export type ArgumentOptionsPartial<O = any> = AllPartial<ArgumentOptions<O>>;

export type ArgumentOptions<O = any> = Merge<
  ArgumentOptionsBase,
  AllPartial<O>
>;

export interface ArgumentOptionsBase {
  required: boolean;
  missingError: string;
}
