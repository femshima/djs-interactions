import { Components, InteractionTypes } from '.';

export interface WithHandlerClassType<T extends typeof Components[number]> {
  customId: string;
  handle?(interaction: InteractionTypes[T]): Promise<void>;
}
