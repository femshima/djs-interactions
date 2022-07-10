import {
  ChatInputApplicationCommandData,
  UserApplicationCommandData,
  MessageApplicationCommandData,
} from 'discord.js';
import { Commands, InteractionTypes } from '.';

export abstract class ApplicationCommandBase<
  T extends typeof Commands[number] = 'CHAT_INPUT'
> {
  abstract definition: T extends 'CHAT_INPUT'
    ? ChatInputApplicationCommandData
    : MessageApplicationCommandData | UserApplicationCommandData;
  abstract handle(interaction: InteractionTypes[T]): Promise<void>;
}
