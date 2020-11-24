import logger from '@packages/logger';
import { container } from 'tsyringe';

import { Namespace } from '@config/containers';

import { Client } from '@interfaces';

import readEvents from '../utils/readEvents';

/**
 * Loads all event listeners from the discord gateway.
 */
function eventsLoader(): void {
  const events = readEvents();
  const client = container.resolve<Client>(Namespace.Client);

  for (const Event of events) {
    const event = container.resolve(Event);

    client.events.set(event.name, event);
  }

  logger.info('All client listeners was loaded.', { label: 'events-loader' });
}

export default eventsLoader;
