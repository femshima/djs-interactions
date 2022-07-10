import { CommandInteraction } from 'discord.js';
import { Command } from '../../src';
import { More } from '../component';

export default class Ping extends Command {
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
