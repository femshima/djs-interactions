import { Collection } from 'discord.js';
import { DataStore } from '.';

interface CtorType {
  new (...args: unknown[]): object;
}

interface Definition<T extends CtorType, U> {
  key: string;
  ctor: T;
  serialize(from: InstanceType<T>): U;
  deserialize(to: U): InstanceType<T>;
}

interface StorageObject {
  type: string;
}

export class DataStoreAdapter<
  K,
  Ctor extends CtorType,
  V2 extends StorageObject
> implements DataStore<K, InstanceType<Ctor>>
{
  definitions: Collection<string, Definition<Ctor, V2>> = new Collection();
  constructor(public store: DataStore<K, V2>) {}
  getUniqueKey() {
    return this.store.getUniqueKey();
  }
  set(key: K, value: InstanceType<Ctor>) {
    const serialized = this.definitions
      .find((o) => value instanceof o.ctor)
      ?.serialize(value);

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
  register<T extends Ctor>(def: Definition<T, V2>) {
    this.definitions.set(def.key, def);
  }
  private deserialize(value?: V2) {
    if (!value?.type) return undefined;
    return this.definitions.get(value.type)?.deserialize(value);
  }
}
