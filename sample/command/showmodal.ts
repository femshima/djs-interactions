import { CommandInteraction } from 'discord.js';
import { Command } from '../../src';
import { MyModal } from '../component';

export default class Ping extends Command {
  definition = {
    name: 'showmodal',
    description: 'Shows Modal',
  };

  async handle(interaction: CommandInteraction<'cached'>) {
    await interaction.showModal(new MyModal());
  }
}
