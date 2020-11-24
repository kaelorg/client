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

      const extendersInstantiated = extenders.map(
        Extender => new Extender(...props),
      );

      for (const extender of extendersInstantiated) {
        const properties = Reflect.ownKeys(extender).concat(
          Reflect.ownKeys(Reflect.getPrototypeOf(extender)),
        );

        properties.forEach(prop => {
          if (
            /^(constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/.test(
              prop as any,
            )
          ) {
            return;
          }

          let propertyDescriptor = Reflect.getOwnPropertyDescriptor(
            extender,
            prop,
          );

          if (!propertyDescriptor) {
            const propertyGetted = Reflect.get(extender, prop);

            propertyDescriptor = {
              value:
                typeof propertyGetted === 'function'
                  ? propertyGetted
                  : propertyGetted,
            };
          }

          Object.defineProperty(this, prop, propertyDescriptor);
        });
      }
    }
  }

  return SuperExtensible;
}

interface Extensible {
  new (...props: any[]): any;
}

interface GetExtender<T extends Extensible> {
  (extensible: T): Extensible;
}

export default extend;
