export { DelayedDataStore } from './delay';
export { DataStoreAdapter } from './adapter';

export interface DataStore<K, V> {
  getUniqueKey(): K;
  set(key: K, value: V): void | Promise<void>;
  get(key: K): V | undefined | Promise<V | undefined>;
  values(): V[] | Promise<V[]>;
  entries(): [K, V][] | Promise<[K, V][]>;
}

export class DefaultDataStore<V> implements DataStore<string, V> {
  store: Map<string, V> = new Map();
  private keyseq = 0;
  getUniqueKey() {
    return (this.keyseq += 1).toString();
  }
  set(key: string, value: V) {
    this.store.set(key, value);
  }
  get(key: string) {
    return this.store.get(key);
  }
  values() {
    return Array.from(this.store.values());
  }
  entries() {
    return Array.from(this.store.entries());
  }
}
