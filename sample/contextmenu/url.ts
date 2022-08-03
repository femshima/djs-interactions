import {
  ApplicationCommandType,
  MessageApplicationCommandData,
  MessageContextMenuCommandInteraction,
} from 'discord.js';
import { MessageContextMenu } from '../../src';

export default class SampleUserContext extends MessageContextMenu {
  definition: MessageApplicationCommandData = {
    type: ApplicationCommandType.Message,
    name: 'url',
  };

  async handle(interaction: MessageContextMenuCommandInteraction<'cached'>) {
    await interaction.reply(interaction.targetMessage.url);
  }
}
