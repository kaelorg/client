import APIWebSocket from '@packages/api-websocket';
import { container } from 'tsyringe';

import { Namespace } from '@config/containers';

export function register(): void {
  container.registerSingleton(Namespace.APIWebSocket, APIWebSocket);
}
