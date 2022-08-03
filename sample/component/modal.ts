import {
  ComponentType,
  ModalSubmitInteraction,
  TextInputStyle,
} from 'discord.js';
import { Modal } from '../../src';

export default class MyModal extends Modal {
  constructor() {
    super({
      title: 'Sample Modal',
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              custom_id: 'text',
              style: TextInputStyle.Short,
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
