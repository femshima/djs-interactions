import {
  ChatInputApplicationCommandData,
  UserApplicationCommandData,
  MessageApplicationCommandData,
} from 'discord.js';
import { InteractionTypes } from '.';

export const Commands = ['CHAT_INPUT', 'MESSAGE', 'USER'] as const;
export function isCommand(arg: unknown): arg is typeof Commands[number] {
  return Commands.includes(arg as typeof Commands[number]);
}

export abstract class ApplicationCommandBase<
  T extends typeof Commands[number] = 'CHAT_INPUT'
> {
  get type() {
    return this.definition.type;
  }
  abstract definition: T extends 'CHAT_INPUT'
    ? ChatInputApplicationCommandData
    : MessageApplicationCommandData | UserApplicationCommandData;
  abstract handle(interaction: InteractionTypes[T]): Promise<void>;
}

export const InteractionBases = {
  CHAT_INPUT: ApplicationCommandBase<'CHAT_INPUT'>,
  MESSAGE: ApplicationCommandBase<'MESSAGE'>,
  USER: ApplicationCommandBase<'USER'>,
};
