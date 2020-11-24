import { join } from 'path';

const baseUrl = join(__dirname, '..');

export function getPath(...paths: string[]): string {
  return join(baseUrl, ...paths);
}

export function getRootPath(...paths: string[]): string {
  return join(baseUrl, '..', ...paths);
}
