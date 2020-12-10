import { KaelDatabase } from '@kaelbot/database';
import { container } from 'tsyringe';

import { Namespace } from '@config/containers';

export function register(): void {
  container.registerSingleton(Namespace.Database, KaelDatabase);
}
