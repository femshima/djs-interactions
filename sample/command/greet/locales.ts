import {
  ApplicationCommandOptionType,
  ApplicationCommandSubCommandData,
  ChatInputCommandInteraction,
} from 'discord.js';
import { SubCommand } from '../../../src';

export default class Locale extends SubCommand {
  definition: ApplicationCommandSubCommandData = {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'locale',
    description: 'shows supported locales',
  };
  async handle(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply('en,ja');
  }
}
