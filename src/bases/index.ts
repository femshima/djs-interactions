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
  Interaction,
} from 'discord.js';
import { ApplicationCommandBase } from './ApplicationCommand';
import { WithHandlerClassType } from './Components';

export * from './ApplicationCommand';
export * from './Components';

export const Commands = ['CHAT_INPUT', 'MESSAGE', 'USER'] as const;
export const Components = ['BUTTON', 'SELECT_MENU', 'MODAL'] as const;

export function isCommand(arg: unknown): arg is typeof Commands[number] {
  return Commands.includes(arg as typeof Commands[number]);
}
export function isComponent(arg: unknown): arg is typeof Components[number] {
  return Components.includes(arg as typeof Components[number]);
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

export function isT<T extends keyof InteractionTypes>(
  type: T,
  target: unknown
): target is InstanceType<typeof InteractionBases[T]> {
  switch (type) {
    case 'BUTTON':
      return target instanceof InteractionBases['BUTTON'];
    case 'SELECT_MENU':
      return target instanceof InteractionBases['SELECT_MENU'];
    case 'MODAL':
      return target instanceof InteractionBases['MODAL'];
  }
  const arg = target as { definition?: { type?: string } };
  if (arg.definition) {
    return type === (arg.definition.type ?? 'CHAT_INPUT');
  }
  return false;
}

export function CallIfMatches(
  target: DataType<keyof InteractionTypes>,
  interaction: Interaction<'cached'>
) {
  if (interaction.isCommand() && isT('CHAT_INPUT', target)) {
    return target.handle(interaction);
  } else if (interaction.isMessageContextMenu() && isT('MESSAGE', target)) {
    return target.handle(interaction);
  } else if (interaction.isUserContextMenu() && isT('USER', target)) {
    return target.handle(interaction);
  } else if (interaction.isButton() && isT('BUTTON', target)) {
    return target.handle?.(interaction);
  } else if (interaction.isSelectMenu() && isT('SELECT_MENU', target)) {
    return target.handle?.(interaction);
  } else if (interaction.isModalSubmit() && isT('MODAL', target)) {
    return target.handle?.(interaction);
  }
}
