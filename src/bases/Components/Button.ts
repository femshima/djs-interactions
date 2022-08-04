import {
  APIButtonComponent,
  ButtonBuilder,
  ButtonInteraction,
} from 'discord.js';
import InitializationError from '../../error/InitializationError';

type DistributiveOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

interface Store {
  getUniqueKey(): string;
  set(key: string, value: Button<Store>): void;
}

export default abstract class Button<T extends Store = Store> {
  readonly type = 'BUTTON';
  data: APIButtonComponent;
  constructor(
    data: DistributiveOmit<APIButtonComponent, 'type' | 'custom_id'>
  ) {
    if (!this.store)
      throw new InitializationError('Do not extend Button directly!');
    const custom_id = this.store.getUniqueKey();
    if ('url' in data) {
      this.data = new ButtonBuilder({ ...data }).toJSON();
    } else {
      this.data = new ButtonBuilder({ ...data, custom_id }).toJSON();
    }
    if ('custom_id' in this.data) {
      this.store.set(this.data.custom_id, this);
    }
  }
  handle?(interaction: ButtonInteraction<'cached'>): Promise<void>;
  toJSON() {
    return this.data;
  }
  get store(): T | undefined {
    return undefined;
  }
}
