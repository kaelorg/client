type ValueOf<T extends Record<any, any>> = T[keyof T];

type Merge<T extends Record<any, any>, M> = T & { [K in keyof M]: M[K] };

type MakePartial<T> = T extends Record<any, any> ? AllPartial<T> : T;

type AllPartial<T> = {
  [K in keyof T]?: MakePartial<T[K]>;
};

interface Constructable<T> {
  new (): T;
}
