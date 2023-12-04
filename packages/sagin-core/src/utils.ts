export type Brand<T, K> = T & { __brand__: K };

export type ValueOf<T> = T[keyof T];
