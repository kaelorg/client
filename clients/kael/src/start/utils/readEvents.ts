import { resolve } from 'path';

import EventStructure from '@core/structures/abstract/EventStructure';

import { Event } from '@interfaces';

import readFolder from './readFolder';

function readEvents(): Constructable<Event>[] {
  return readFolder<Constructable<Event>>(
    resolve(__dirname, '..', '..', 'app', 'modules', 'events'),
    event => Object.getPrototypeOf(event) === EventStructure,
  );
}

export default readEvents;
