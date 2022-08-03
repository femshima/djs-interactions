import {
  ChatInputApplicationCommandData,
  UserApplicationCommandData,
  MessageApplicationCommandData,
  ApplicationCommandType,
} from 'discord.js';
import { InteractionTypes } from '.';

export const Commands = ['CHAT_INPUT', 'MESSAGE', 'USER'] as const;
export function isCommand(arg: unknown): arg is typeof Commands[number] {
  return Commands.includes(arg as typeof Commands[number]);
}

interface Definition {
  CHAT_INPUT: ChatInputApplicationCommandData;
  MESSAGE: MessageApplicationCommandData;
  USER: UserApplicationCommandData;
}

export abstract class ApplicationCommandBase<
  T extends typeof Commands[number] = 'CHAT_INPUT'
> {
  get type() {
    switch (this.definition.type) {
      case ApplicationCommandType.ChatInput:
      case undefined:
        return 'CHAT_INPUT';
      case ApplicationCommandType.Message:
        return 'MESSAGE';
      case ApplicationCommandType.User:
        return 'USER';
    }
  }
  abstract definition: Definition[T];
  abstract handle(interaction: InteractionTypes[T]): Promise<void>;
}

export const InteractionBases = {
  CHAT_INPUT: ApplicationCommandBase<'CHAT_INPUT'>,
  MESSAGE: ApplicationCommandBase<'MESSAGE'>,
  USER: ApplicationCommandBase<'USER'>,
};

export type ApplicationCommandBases =
  | ApplicationCommandBase<'CHAT_INPUT'>
  | ApplicationCommandBase<'MESSAGE'>
  | ApplicationCommandBase<'USER'>;
