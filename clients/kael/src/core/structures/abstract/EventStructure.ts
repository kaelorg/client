import { EventStructure as IEventStructure } from '@interfaces';

abstract class EventStructure implements IEventStructure {
  get name(): string {
    return this.constructor.name.replace(/Event/, '');
  }
}

// type IgnoreKeys = keyof EventStructure<any>;

// type EventListeners<T extends EventStructure<T>> = Listener<T>[];

// interface Handler {
//   (...params: any[]): any;
// }

// interface Listener<
//   T extends EventStructure<T>,
//   H extends keyof Omit<T, IgnoreKeys> = keyof Omit<T, IgnoreKeys>
// > {
//   name: string;
//   handler: H extends IgnoreKeys ? never : T[H] extends Handler ? H : never;
// }

export default EventStructure;
