import {
  MessageContextMenuCommandInteraction,
  MessageApplicationCommandData,
} from 'discord.js';

export default abstract class MessageApplicationCommandBase {
  readonly type = 'MESSAGE';
  abstract definition: MessageApplicationCommandData;
  abstract handle(
    interaction: MessageContextMenuCommandInteraction<'cached'>
  ): Promise<void>;
}
