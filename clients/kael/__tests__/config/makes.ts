import { container } from 'tsyringe';

import { Namespace } from '../../src/config/containers';
import { Client } from '../../src/interfaces';
import { loadContainers } from '../../src/start/load';

export function before(): void {
  loadContainers();
}

export function after(): void {
  const hasClientContainer = container.isRegistered(Namespace.Client);

  if (hasClientContainer) {
    const client = container.resolve<Client>(Namespace.Client);

    client.destroy();
  }

  container.reset();
}
