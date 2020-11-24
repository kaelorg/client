import { container } from 'tsyringe';

import Client from '@core/client/Client';

import { Namespace } from '@config/containers';

export function register(): void {
  container.registerSingleton(Namespace.Client, Client);
}
