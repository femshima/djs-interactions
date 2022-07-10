import { ModalSubmitInteraction } from 'discord.js';
import { interactionFrame } from '../interaction';

export default class MyModal extends interactionFrame.Base('MODAL') {
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
