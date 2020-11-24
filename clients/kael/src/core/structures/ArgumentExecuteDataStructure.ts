import { ArgumentExecuteDataStructure as IArgumentExecuteDataStructure } from '@interfaces';

class ArgumentExecuteDataStructure implements IArgumentExecuteDataStructure {
  public readonly argument: string;

  public readonly fullArgument: string;

  public readonly allArguments: string[];

  constructor({ args }: Data) {
    const [argument] = args;

    this.argument = argument;
    this.allArguments = args;
    this.fullArgument = args.join(' ');
  }
}

interface Data {
  args: string[];
}

export default ArgumentExecuteDataStructure;
