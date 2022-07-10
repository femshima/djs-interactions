import { ModalSubmitInteraction } from 'discord.js';
import { Modal } from '../../src';

export default class MyModal extends Modal {
  constructor() {
    super({
      customId: 'modal',
      title: 'Sample Modal',
      components: [
        {
          type: 'ACTION_ROW',
          components: [
            {
              type: 'TEXT_INPUT',
              customId: 'text',
              style: 'SHORT',
              label: 'TXT',
            },
          ],
        },
      ],
    });
  }
  async handle(interaction: ModalSubmitInteraction<'cached'>) {
    interaction.reply(JSON.stringify(interaction.components));
  }
}
