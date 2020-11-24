const maxTimeAccepted = 2147483647;

class Timeout {
  private running = false;

  private timeLeft: number;

  public readonly ms: number;

  private timeout?: NodeJS.Timeout;

  private readonly callback: Callback;

  constructor(callback: Callback, ms: number) {
    const msParsed = ms >= 1000 ? ms : 1000;

    this.ms = msParsed;
    this.timeLeft = msParsed;
    this.callback = callback;

    this.register();
  }

  get executable(): boolean {
    return this.timeLeft <= 0;
  }

  get isMaximum(): boolean {
    return this.timeLeft > maxTimeAccepted;
  }

  public delete(): this {
    if (this.timeout) clearTimeout(this.timeout);

    this.running = false;
    return this;
  }

  private register(): void {
    if (this.running) return;

    this.running = true;
    this.run();
  }

  private makeTimeout(): NodeJS.Timeout {
    let time = this.timeLeft;

    if (this.isMaximum) time = maxTimeAccepted;

    this.timeLeft -= time;
    return setTimeout(() => this.run(), time);
  }

  private run(): void {
    if (this.executable) {
      try {
        this.callback();
      } catch {
        // Silent
      }

      this.delete();
      return;
    }

    this.timeout = this.makeTimeout();
  }
}

type Callback = () => any;

export default Timeout;
