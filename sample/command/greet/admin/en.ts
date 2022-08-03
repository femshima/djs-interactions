import {
  ApplicationCommandOptionType,
  ApplicationCommandSubCommandData,
  ChatInputCommandInteraction,
} from 'discord.js';
import { SubCommand } from '../../../../src';

export default class En extends SubCommand {
  definition: ApplicationCommandSubCommandData = {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'en',
    description: 'Greet in English for Admins!',
  };
  async handle(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply('Hello, admin!');
  }
}
