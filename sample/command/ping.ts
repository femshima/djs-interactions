import { CommandInteraction } from 'discord.js';
import { More } from '../component';
import { interactionFrame } from '../interaction';

export default class Ping extends interactionFrame.Base('CHAT_INPUT') {
  definition = {
    name: 'ping',
    description: 'Ping!',
  };

  async handle(interaction: CommandInteraction<'cached'>) {
    await interaction.reply({
      content: 'Pong!',
      components: [
        {
          type: 'ACTION_ROW',
          components: [new More('Hello!')],
        },
      ],
    });
  }
}
