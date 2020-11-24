import { Connection } from 'adonis-node-websocket';
import debug from 'debug';

import config from './config';

class APIWebSocket extends Connection {
  constructor() {
    super(config.url, config);

    this.on('debug', message => {
      debug('api-websocket:debug')(message);
    });

    this.on('error', message => {
      debug('api-websocket:error')(
        message.stack || message || 'No error message was provided.',
      );
    });

    this.once('ready', () => {
      this.subscribeChannels();

      debug('api-websocket:ready')(
        'Connection to the API websocket was successful.',
      );
    });
  }

  public connect(force = true): this {
    if (process.env.NODE_ENV !== 'production' && !force) {
      return this;
    }

    return super.connect();
  }

  private subscribeChannels(): void {
    const subscriptions = ['vanity'];

    for (const subscription of subscriptions) {
      super.subscribe(subscription);
    }

    debug('api-websocket:subscribe-channels')(
      'I\'am subscribed to channels "%s".',
      subscriptions.join(', '),
    );
  }
}

export default APIWebSocket;
