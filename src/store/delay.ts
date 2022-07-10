import { DataStore, DefaultDataStore } from '.';

export class DelayedDataStore<V> implements DataStore<string, V> {
  store: DataStore<string, V> = new DefaultDataStore<V>();
  getUniqueKey() {
    return this.store.getUniqueKey();
  }
  set(key: string, value: V) {
    return this.store.set(key, value);
  }
  get(key: string) {
    return this.store.get(key);
  }
  values() {
    return this.store.values();
  }
  entries() {
    return this.store.entries();
  }
  async setStore(store: DataStore<string, V>) {
    const entries = await this.store.entries();
    for (const [k, v] of entries) {
      await store.set(k, v);
    }
    this.store = store;
  }
}
