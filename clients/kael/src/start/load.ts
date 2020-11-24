import { getFolderModules } from '@packages/utils';
import { each, eachSeries } from 'async';
import { resolve } from 'path';

const loadersPath = resolve(__dirname, 'loaders');
const containersPath = resolve(__dirname, '..', 'core', 'containers');

/**
 * Load containers.
 */
export function loadContainers(): void {
  const containers = getFolderModules<Container>(containersPath, true);

  for (const container of containers) {
    container.register();
  }
}

/**
 * Load client modules.
 */
export async function loadLoaders(): Promise<void> {
  const loaders = getFolderModules<Loader>(loadersPath, true);

  await each<Loader>(loaders, async loader => loader());
}

/**
 * Loads the necessary modules to start the Client.
 */
async function load(): Promise<void> {
  await eachSeries([loadContainers, loadLoaders], async run => run());
}

interface Loader {
  (): void | Promise<void>;
}

interface Container {
  register: () => void;
}

export default load;
