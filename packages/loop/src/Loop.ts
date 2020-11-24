import { EventEmitter } from 'events';

import Operations from './Operations';

class Loop extends EventEmitter {
  private running = true;

  private timeout?: NodeJS.Timeout;

  private readonly operationDelay: number;

  private callback!: () => Promise<boolean>;

  public readonly operations = new Operations();

  constructor(operationDelay: number) {
    super();

    this.operationDelay = operationDelay;
  }

  public start(callback: Callback): void {
    this.registerCallback(callback).execute(this.operations.last === 0);
  }

  public stop(): void {
    this.running = false;

    if (this.timeout) clearTimeout(this.timeout);
  }

  private execute(force = false): void {
    const loop = () => {
      if (!this.running) return;
      return this.execute();
    };

    if (force) this.handle().then(loop);
    else {
      this.timeout = setTimeout(
        () => this.handle().then(loop),
        this.operationDelay,
      );
    }
  }

  private registerCallback(callback: Callback): this {
    const myCallback = async () => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<boolean>(async resolve => {
        const { operations } = this;

        await callback(operations, operations.last);
        resolve(true);
      });
    };

    this.callback = myCallback;
    return this;
  }

  private async handle(): Promise<void> {
    let success = false;
    const startTimestamp = Date.now();

    try {
      success = await this.callback();
    } catch {
      // void
    } finally {
      this.operations.setOperation({
        success,
        time: Date.now() - startTimestamp,
      });
    }
  }
}

type Callback = (operations: Operations, operationNumber: number) => any;

export default Loop;
