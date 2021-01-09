const OWN_FILTER_PROPERTIES = [
  'name',
  'bind',
  'call',
  'apply',
  'caller',
  'length',
  'toString',
  'prototype',
  'arguments',
  'constructor',
];

function extend<T extends Extensible>(
  extensible: T,
  extender: GetExtender<T>,
): Extensible {
  return extender(extensible);
}

export function extendAll<T extends Extensible>(
  Extensible: T,
  ...extenders: Extensible[]
): Extensible {
  class SuperExtensible extends Extensible {
    constructor(...props: any[]) {
      super(...props);

      for (const extender of extenders) {
        const properties = Object.getOwnPropertyDescriptors(extender.prototype);

        OWN_FILTER_PROPERTIES.forEach(property => {
          delete properties[property];
        });

        Object.defineProperties(this, properties);
      }
    }
  }

  Object.defineProperty(SuperExtensible, 'name', {
    value: Extensible.name,
  });

  return SuperExtensible;
}

interface Extensible {
  new (...props: any[]): any;
}

interface GetExtender<T extends Extensible> {
  (extensible: T): Extensible;
}

export default extend;
