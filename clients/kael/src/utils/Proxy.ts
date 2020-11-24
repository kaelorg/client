function createProxy<T extends Record<any, any>, G extends Record<any, any>>(
  target: T,
  resolver: G,
): T & G {
  return new Proxy(target, {
    get: (_target, getter: keyof T | keyof G) =>
      resolver[getter] || target[getter],
  });
}

export default createProxy;
