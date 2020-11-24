/* eslint-disable @typescript-eslint/no-empty-interface */

export interface ArgumentExecuteData extends ArgumentExecuteDataStructure {}

export interface ArgumentExecuteDataStructure {
  argument: string;
  fullArgument: string;
  allArguments: string[];
}
