import { container } from 'tsyringe';

import CommandCache from '@core/cache/CommandCache';

import { Namespace } from '@config/containers';

export function register(): void {
  container.registerSingleton(Namespace.CommandCache, CommandCache);
}
