/* eslint-disable global-require, import/no-dynamic-require */

import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

export function getFolderModules<T = any>(
  directory: string,
  emitError = false,
): T[] {
  return readdirSync(directory)
    .map(filePath => {
      try {
        const fileRequire = require(join(directory, filePath));

        return (fileRequire && fileRequire.default) || fileRequire;
      } catch (error) {
        if (emitError) throw error;
        return null;
      }
    })
    .filter(Boolean);
}

export function getAllFolderModules<T = any>(
  directory: string,
  emitError = false,
): T[] {
  return readdirSync(directory)
    .map(file => {
      const fileFullPath = join(directory, file);

      if (lstatSync(fileFullPath).isDirectory()) {
        return getAllFolderModules(fileFullPath);
      }

      try {
        const fileRequire = require(fileFullPath);

        return (fileRequire && fileRequire.default) || fileRequire;
      } catch (error) {
        if (emitError) throw error;
        return null;
      }
    })
    .flatMap(modules => modules)
    .filter(Boolean);
}
