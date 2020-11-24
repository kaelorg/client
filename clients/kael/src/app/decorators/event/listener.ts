import { ClientEvents } from 'discord.js';
import { container } from 'tsyringe';

import { Namespace } from '@config/containers';

import { Event, Client } from '@interfaces';

function listener<E extends keyof ClientEvents>(
  event: E,
  options: Options = {} as Options,
) {
  return <T extends Event>(target: T, propertyKey: string) => {
    const client = container.resolve<Client>(Namespace.Client);

    function set(): void {
      const myEvent = client.events.get(target.name) as Event;
      const handler = Reflect.get(target, propertyKey) as Handler;
      const listenerHandler = handler.bind(myEvent);

      const { once = false } = options;

      if (once) {
        client.once(event, listenerHandler);
      } else {
        client.on(event, listenerHandler);
      }
    }

    const interval = setInterval(() => {
      if (!client.events.has(target.name)) {
        return;
      }

      set();
      clearInterval(interval);
    }, 500);
  };
}

interface Handler {
  (this: Event, ...args: any[]): any;
}

interface Options {
  once: boolean;
}

export default listener;
