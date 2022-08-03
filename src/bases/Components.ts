import {
  APIButtonComponent,
  APIModalInteractionResponseCallbackData,
  APISelectMenuComponent,
  ButtonBuilder,
  ModalBuilder,
  SelectMenuBuilder,
} from 'discord.js';
import { InteractionTypes } from '.';

export const Components = ['BUTTON', 'SELECT_MENU', 'MODAL'] as const;
export function isComponent(arg: unknown): arg is typeof Components[number] {
  return Components.includes(arg as typeof Components[number]);
}

type DistributiveOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export interface ComponentDataType {
  BUTTON: APIButtonComponent;
  SELECT_MENU: APISelectMenuComponent;
  MODAL: APIModalInteractionResponseCallbackData;
}

export type ComponentParamType<T extends typeof Components[number]> =
  DistributiveOmit<ComponentDataType[T], 'type' | 'custom_id'>;

export const DataParser: {
  [k in keyof ComponentDataType]: (
    data: ComponentParamType<k>,
    customId: string
  ) => ComponentDataType[k];
} = {
  BUTTON: (data, custom_id) => {
    if ('url' in data) {
      return new ButtonBuilder({ ...data }).toJSON();
    } else {
      return new ButtonBuilder({ custom_id, ...data }).toJSON();
    }
  },
  SELECT_MENU: (data, custom_id) =>
    new SelectMenuBuilder({ custom_id, ...data }).toJSON(),
  MODAL: (data, custom_id) => new ModalBuilder({ custom_id, ...data }).toJSON(),
};

export interface WithHandlerClassType<T extends typeof Components[number]> {
  readonly type: T;
  data: ComponentDataType[T];
  handle?(interaction: InteractionTypes[T]): Promise<void>;
  toJSON(): ComponentDataType[T];
}
