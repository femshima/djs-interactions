import {
  ApplicationCommandOptionData,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
} from 'discord.js';

export interface ChatInputApplicationCommandDataWithSubCommand
  extends Omit<ChatInputApplicationCommandData, 'options'> {
  options?: (ApplicationCommandOptionData | SubCommand | SubCommandGroup)[];
}
export interface SubCommandGroupDefinition
  extends Omit<ApplicationCommandSubGroupData, 'options'> {
  options?: (ApplicationCommandSubCommandData | SubCommand)[];
}

export abstract class SubCommand {
  abstract definition: ApplicationCommandSubCommandData;
  abstract handle(
    interaction: ChatInputCommandInteraction<'cached'>
  ): Promise<void>;
}
export abstract class SubCommandGroup {
  abstract definition: SubCommandGroupDefinition;
  handle?(interaction: ChatInputCommandInteraction<'cached'>): Promise<void>;
}
