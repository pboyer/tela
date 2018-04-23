import { Map, Iterable, Record } from 'immutable';

export function newTypedFactory<E, T extends TypedRecord<T> & E>(defaultState: E, name?: string): (val?: Partial<E>) => T {
  const ImmutableRecord = Record(defaultState, name);
  return (val: E = null): T => new ImmutableRecord(val) as T;
};

export interface TypedRecord<T extends TypedRecord<T>>
  extends Map<string, any> {

  set: (prop: string, val: any) => T;
  delete: (key: string) => T;
  remove: (key: string) => T;
  clear: () => T;
  update: {
    (updater: (value: T) => any): T;
    (key: string, updater: (value: any) => any): T;
    (key: string, notSetValue: any, updater: (value: any) => any): T;
  };
  merge: (obj: any) => T;
  mergeWith: (
    merger: (previous?: any, next?: any, key?: string) => any,
    obj: any
  ) => T;
  mergeDeep: (obj: any) => T;
  mergeDeepWith: (
    merger: (previous?: any, next?: any, key?: string) => any,
    obj: any
  ) => T;
  setIn: (keyPath: any[] | Iterable<any, any>, value: any) => T;
  deleteIn: (keyPath: Array<any> | Iterable<any, any>) => T;
  removeIn: (keyPath: Array<any> | Iterable<any, any>) => T;
  updateIn: {
    (keyPath: any[] | Iterable<any, any>, updater: (value: any) => any): T;
    (
      keyPath: any[] | Iterable<any, any>,
      notSetValue: any,
      updater: (value: any) => any
    ): T
  };
  mergeIn: (keyPath: any[] | Iterable<any, any>, obj: any) => T;
  mergeDeepIn: (keyPath: any[] | Iterable<any, any>, obj: any) => T;
  withMutations: (mutator: (mutable: T) => any) => T;
  asMutable: () => T;
  asImmutable: () => T;
};

export function recordify<E, T extends TypedRecord<T> & E>(
  defaultVal: E,
  val: E = null,
  name?: string): T {

  const TypedRecordFactory = newTypedFactory<E, T>(defaultVal, name);
  return val ? TypedRecordFactory(val) : TypedRecordFactory();
};
