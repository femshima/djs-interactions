import { Collection } from 'discord.js';

export interface DataStore<K1, K2, V> {
  set(key1: K1, key2: K2, value: V): void;
  get(key1: K1, key2: K2): V | undefined;
  map<T>(fn: (key1: K1, key2: K2, value: V) => T): T[];
}

export class DefaultDataStore<K1, K2, V> implements DataStore<K1, K2, V> {
  store: Collection<K1, Collection<K2, V>> = new Collection();
  set(key1: K1, key2: K2, value: V): void {
    this.store.ensure(key1, () => new Collection()).set(key2, value);
  }
  get(key1: K1, key2: K2): V | undefined {
    return this.store.get(key1)?.get(key2);
  }
  map<T>(fn: (key1: K1, key2: K2, value: V) => T): T[] {
    return this.store
      .map((coll, k1) => coll.map((v, k2) => fn(k1, k2, v)))
      .flat();
  }
}
