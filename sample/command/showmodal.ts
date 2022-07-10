import { CommandInteraction } from 'discord.js';
import { MyModal } from '../component';
import { interactionFrame } from '../interaction';

export default class Ping extends interactionFrame.Base('CHAT_INPUT') {
  definition = {
    name: 'showmodal',
    description: 'Shows Modal',
  };

  async handle(interaction: CommandInteraction<'cached'>) {
    await interaction.showModal(new MyModal());
  }
}
