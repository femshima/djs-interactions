import {
  UserContextMenuCommandInteraction,
  UserApplicationCommandData,
} from 'discord.js';

export default abstract class UserApplicationCommandBase {
  readonly type = 'USER';
  abstract definition: UserApplicationCommandData;
  abstract handle(
    interaction: UserContextMenuCommandInteraction<'cached'>
  ): Promise<void>;
}
