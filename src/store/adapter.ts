import { Collection } from 'discord.js';
import { DataStore } from '.';

interface CtorType<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...a: any[]): T;
}

interface Definition<T extends object, U> {
  key: string;
  ctor: CtorType<T>;
  serialize(from: T): U;
  deserialize(to: U): T;
}

export interface StorageObject<D> {
  type: string;
  data: D;
}

export class DataStoreAdapter<
  K,
  D1 extends object,
  D extends object,
  Store extends DataStore<K, StorageObject<D>>
> implements DataStore<K, D1>
{
  definitions: Collection<string, Definition<D1, D>> = new Collection();
  constructor(public store: Store) {}
  getUniqueKey() {
    return this.store.getUniqueKey();
  }
  set(key: K, value: D1) {
    const serialized = this.serlialize(value);

    if (!serialized) throw new Error(`Unknown instance: ${value}`);

    return this.store.set(key, serialized);
  }
  async get(key: K) {
    const value = await this.store.get(key);
    return this.deserialize(value);
  }
  async values() {
    const values = await this.store.values();
    return values
      .map((v) => this.deserialize(v))
      .filter(
        (v): v is Exclude<typeof v, undefined> => typeof v !== 'undefined'
      );
  }
  async entries() {
    const values = await this.store.entries();
    return values
      .map(([k, v]) => [k, this.deserialize(v)] as const)
      .filter(
        (arg): arg is [typeof arg[0], Exclude<typeof arg[1], undefined>] =>
          typeof arg[1] !== 'undefined'
      );
  }
  register<T extends D1>(def: Definition<T, D>) {
    this.definitions.set(def.key, def);
  }
  private serlialize(value: D1) {
    const def = this.definitions.find((o) => value instanceof o.ctor);
    if (!def) return undefined;
    return { type: def.key, data: def.serialize(value) };
  }
  private deserialize(value?: StorageObject<D>) {
    if (!value?.type) return undefined;
    return this.definitions.get(value.type)?.deserialize(value.data);
  }
}
