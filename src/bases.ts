import {
  ButtonInteraction,
  SelectMenuInteraction,
  MessageButton,
  MessageSelectMenu,
  Modal,
  ModalSubmitInteraction,
  CommandInteraction,
  MessageContextMenuInteraction,
  UserContextMenuInteraction,
  ChatInputApplicationCommandData,
  UserApplicationCommandData,
  MessageApplicationCommandData,
} from 'discord.js';
import { DataStore } from './store';

export const Commands = ['CHAT_INPUT', 'MESSAGE', 'USER'] as const;
export const Components = ['BUTTON', 'SELECT_MENU', 'MODAL'] as const;

export function isCommand(arg: unknown): arg is typeof Commands[number] {
  return Commands.includes(arg as typeof Commands[number]);
}
export function isComponent(arg: unknown): arg is typeof Components[number] {
  return Components.includes(arg as typeof Components[number]);
}

export const register = Symbol();
export abstract class ApplicationCommandBase<
  T extends typeof Commands[number] = 'CHAT_INPUT'
> {
  abstract definition: T extends 'CHAT_INPUT'
    ? ChatInputApplicationCommandData
    : MessageApplicationCommandData | UserApplicationCommandData;
  abstract handle(interaction: InteractionTypes[T]): Promise<void>;
  [register](store: DataStore<keyof InteractionTypes, string, DataTypes>) {
    const type: T = (this.definition.type ?? 'CHAT_INPUT') as T;
    store.set<T>(type, this.definition.name, this as DataTypes[T]);
  }
}

export interface WithHandlerClassType<T extends typeof Components[number]> {
  customId: string;
  handle?(interaction: InteractionTypes[T]): Promise<void>;
}

export const InteractionBases = {
  CHAT_INPUT: ApplicationCommandBase<'CHAT_INPUT'>,
  MESSAGE: ApplicationCommandBase<'MESSAGE'>,
  USER: ApplicationCommandBase<'USER'>,
  BUTTON: MessageButton,
  SELECT_MENU: MessageSelectMenu,
  MODAL: Modal,
};

export interface InteractionTypes {
  CHAT_INPUT: CommandInteraction<'cached'>;
  MESSAGE: MessageContextMenuInteraction<'cached'>;
  USER: UserContextMenuInteraction<'cached'>;
  BUTTON: ButtonInteraction<'cached'>;
  SELECT_MENU: SelectMenuInteraction<'cached'>;
  MODAL: ModalSubmitInteraction<'cached'>;
}

type DataType<T extends keyof InteractionTypes> =
  T extends typeof Commands[number]
    ? ApplicationCommandBase<T>
    : T extends typeof Components[number]
    ? InstanceType<typeof InteractionBases[T]> & WithHandlerClassType<T>
    : never;

export type DataTypes = {
  [k in keyof InteractionTypes]: DataType<k>;
};

export interface Ctor<T extends keyof InteractionTypes> {
  new (
    ...args: ConstructorParameters<typeof InteractionBases[T]>
  ): DataTypes[T];
}
