import {
  ApplicationCommandType,
  UserApplicationCommandData,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { UserContextMenu } from '../../src';

export default class UserCreatedAt extends UserContextMenu {
  definition: UserApplicationCommandData = {
    type: ApplicationCommandType.User,
    name: 'created_at',
  };

  async handle(interaction: UserContextMenuCommandInteraction<'cached'>) {
    await interaction.reply(interaction.targetUser.createdAt.toISOString());
  }
}
