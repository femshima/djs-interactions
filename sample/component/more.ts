import { ButtonInteraction } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import { interactionFrame } from '../interaction';

export default class More extends interactionFrame.baseComponent('BUTTON') {
  constructor(private message: string) {
    super({
      customId: 'more',
      label: 'More!',
      style: MessageButtonStyles.PRIMARY,
    });
  }
  async handle(interaction: ButtonInteraction<'cached'>) {
    interaction.reply(`${this.message}\n${interaction.message.content}`);
  }
}
