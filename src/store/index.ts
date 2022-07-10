export interface DataStore<K, V> {
  getUniqueKey(): K;
  set(key: K, value: V): void | Promise<void>;
  get(key: K): V | undefined | Promise<V | undefined>;
  values(): V[] | Promise<V[]>;
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
  get(key: string): V | undefined {
    return this.store.get(key);
  }
  values(): V[] {
    return Array.from(this.store.values());
  }
}
