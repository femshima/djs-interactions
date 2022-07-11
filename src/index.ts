import { DataTypes, InteractionTypes } from './bases';
import { DataStore, DataStoreAdapter, StorageObject } from './store';

export {
  DataStore,
  DefaultDataStore,
  DelayedDataStore,
  StorageObject,
} from './store';
export { default as InteractionFrame } from './frame';
export * from './init';

export class Adapter<
  D extends object,
  Store extends DataStore<string, StorageObject<D>>
> extends DataStoreAdapter<
  string,
  DataTypes[keyof InteractionTypes],
  D,
  Store
> {}
