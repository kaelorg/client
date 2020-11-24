import { getAllFolderModules } from '@packages/utils';
import { resolve } from 'path';

function readFolder<T>(directory: string, filter?: Filter): T[] {
  const readModules = getAllFolderModules<T>(resolve(directory));

  return readModules.filter(filter || Boolean);
}

interface Filter {
  (value: any): boolean;
}

export default readFolder;
