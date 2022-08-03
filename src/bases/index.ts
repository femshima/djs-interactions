import {
  ButtonInteraction,
  SelectMenuInteraction,
  ModalSubmitInteraction,
  CommandInteraction,
  Interaction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import {
  ApplicationCommandBase,
  Commands,
  InteractionBases,
} from './ApplicationCommand';
import {
  ComponentParamType,
  Components,
  WithHandlerClassType,
} from './Components';

export * from './ApplicationCommand';
export * from './Components';

export interface InteractionTypes {
  CHAT_INPUT: CommandInteraction<'cached'>;
  MESSAGE: MessageContextMenuCommandInteraction<'cached'>;
  USER: UserContextMenuCommandInteraction<'cached'>;
  BUTTON: ButtonInteraction<'cached'>;
  SELECT_MENU: SelectMenuInteraction<'cached'>;
  MODAL: ModalSubmitInteraction<'cached'>;
}

type DataType<T extends keyof InteractionTypes> =
  T extends typeof Commands[number]
    ? ApplicationCommandBase<T>
    : T extends typeof Components[number]
    ? WithHandlerClassType<T>
    : never;

export type DataTypes = {
  [k in keyof InteractionTypes]: DataType<k>;
};

type ConstructorParams<T extends keyof InteractionTypes> =
  T extends typeof Commands[number]
    ? ConstructorParameters<typeof InteractionBases[T]>
    : T extends typeof Components[number]
    ? [data: ComponentParamType<T>]
    : never;

export interface Ctor<T extends keyof InteractionTypes> {
  new (...args: ConstructorParams<T>): DataTypes[T];
}

export function isT<T extends keyof InteractionTypes>(
  type: T,
  target: unknown
): target is DataType<T> {
  const arg = target as { type?: string };
  return type === (arg.type ?? 'CHAT_INPUT');
}

export function CallIfMatches(
  target: DataType<keyof InteractionTypes>,
  interaction: Interaction<'cached'>
) {
  if (interaction.isChatInputCommand() && isT('CHAT_INPUT', target)) {
    return target.handle(interaction);
  } else if (
    interaction.isMessageContextMenuCommand() &&
    isT('MESSAGE', target)
  ) {
    return target.handle(interaction);
  } else if (interaction.isUserContextMenuCommand() && isT('USER', target)) {
    return target.handle(interaction);
  } else if (interaction.isButton() && isT('BUTTON', target)) {
    return target.handle?.(interaction);
  } else if (interaction.isSelectMenu() && isT('SELECT_MENU', target)) {
    return target.handle?.(interaction);
  } else if (interaction.isModalSubmit() && isT('MODAL', target)) {
    return target.handle?.(interaction);
  }
}
