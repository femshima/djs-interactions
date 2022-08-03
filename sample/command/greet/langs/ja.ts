import {
  ApplicationCommandOptionType,
  ApplicationCommandSubCommandData,
  ChatInputCommandInteraction,
} from 'discord.js';
import { SubCommand } from '../../../../src';

export default class Ja extends SubCommand {
  definition: ApplicationCommandSubCommandData = {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'ja',
    description: '日本語で挨拶する',
  };
  async handle(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply('こんにちは');
  }
}
