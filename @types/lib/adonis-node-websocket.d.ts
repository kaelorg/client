declare module 'adonis-node-websocket' {
  import { EventEmitter } from 'events';

  export class Subscriptions extends Map<string, Socket> {
    get(key: 'vanity'): Socket;

    get(key: 'role-all'): Socket;

    get(key: 'ban-freeze'): Socket;

    get(key: 'suggestion'): Socket;

    get(key: string): Socket | undefined;
  }

  export class Socket extends EventEmitter {
    send(event: string, data: any): void;
  }

  export class Connection extends EventEmitter {
    readonly subscriptions: Subscriptions;

    constructor(webSocketUrl: string, options?: Record<string, any>);

    connect(): this;

    subscribe(topic: string): Socket;
  }
}
