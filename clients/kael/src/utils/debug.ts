import makeDebug from 'debug';

function makeFullNamespace(namespace: string): string {
  return `kael:${namespace}`;
}

function debug(namespace: string, formatter: any, ...args: any[]): void {
  makeDebug(makeFullNamespace(namespace))(formatter, ...args);
}

export default debug;
