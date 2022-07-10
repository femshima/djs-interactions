import { Collection } from 'discord.js';

export interface DataStore<
  K1 extends string,
  K2,
  VT extends Record<K1, unknown>
> {
  set<T extends K1>(key1: T, key2: K2, value: VT[T]): void;
  get<T extends K1>(key1: T, key2: K2): VT[T] | undefined;
  map<T>(fn: <U extends K1>(key1: U, key2: K2, value: VT[U]) => T): T[];
}

export class DefaultDataStore<
  K1 extends string,
  K2,
  VT extends Record<K1, unknown>
> implements DataStore<K1, K2, VT>
{
  store: Collection<K1, Collection<K2, VT[K1]>> = new Collection();
  set<T extends K1>(key1: T, key2: K2, value: VT[T]): void {
    this.store.ensure(key1, () => new Collection()).set(key2, value);
  }
  get<T extends K1>(key1: T, key2: K2): VT[T] | undefined {
    return this.store.get(key1)?.get(key2) as VT[T] | undefined;
  }
  map<T>(fn: <U extends K1>(key1: U, key2: K2, value: VT[U]) => T): T[] {
    return this.store
      .map((coll, k1) => coll.map((v, k2) => fn(k1, k2, v)))
      .flat();
  }
}
