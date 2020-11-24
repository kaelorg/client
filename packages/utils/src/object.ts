import isNull from './isNull';

export function isObject(value: any): boolean {
  return value && value.constructor === Object;
}

export function hasInObject(obj: Record<any, any>, search: string): boolean {
  return Object.values(obj).some(value => value === search);
}

export function cloneObject<T extends Record<any, any>>(
  object: T,
  createObject: any = object,
): T {
  return Object.assign(Object.create(createObject), object);
}

export function removeProperties<T, P extends keyof T>(
  object: T,
  props: P | P[],
): Omit<T, P> {
  const clonedObject = cloneObject(object);

  for (const prop of ([] as P[]).concat(props)) delete clonedObject[prop];

  return clonedObject;
}

export function mergeDefault<T>(
  defaultObject: T,
  givenObject: AllPartial<T>,
): T {
  if (!givenObject) return defaultObject;

  return Object.entries(defaultObject).reduce((object, [key, value]) => {
    const givenValue = givenObject[key];
    const newObject = cloneObject(object, { [key]: givenValue });

    if (isObject(value)) {
      newObject[key] = isObject(givenValue)
        ? mergeDefault(value, givenValue)
        : value;
    } else {
      newObject[key] = isNull(givenValue) ? value : givenValue;
    }

    return newObject;
  }, Object.assign(cloneObject(defaultObject), givenObject));
}
