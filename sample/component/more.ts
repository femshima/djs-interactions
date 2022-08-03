import { ButtonInteraction, ButtonStyle } from 'discord.js';
import { Button } from '../../src';

export default class More extends Button {
  constructor(private message: string) {
    super({
      label: 'More!',
      style: ButtonStyle.Primary,
    });
  }
  async handle(interaction: ButtonInteraction<'cached'>) {
    interaction.reply(`${this.message}\n${interaction.message.content}`);
  }
}
