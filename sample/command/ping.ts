import {
  ChatInputApplicationCommandData,
  CommandInteraction,
} from 'discord.js';
import { ApplicationCommandBase } from '../../src';
import { More } from '../component';

export default class Ping extends ApplicationCommandBase<'CHAT_INPUT'> {
  definition: ChatInputApplicationCommandData & { type: 'CHAT_INPUT' } = {
    type: 'CHAT_INPUT',
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
