import {
  ButtonInteraction,
  SelectMenuInteraction,
  MessageButton,
  MessageSelectMenu,
  Modal,
  ModalSubmitInteraction,
  ApplicationCommandData,
  CommandInteraction,
  MessageContextMenuInteraction,
  UserContextMenuInteraction,
} from 'discord.js';

export interface ApplicationCommandInteractionType {
  CHAT_INPUT: CommandInteraction<'cached'>;
  MESSAGE: MessageContextMenuInteraction<'cached'>;
  USER: UserContextMenuInteraction<'cached'>;
}

export abstract class ApplicationCommandBase<
  T extends keyof ApplicationCommandInteractionType
> {
  abstract definition: ApplicationCommandData & { type: T };
  abstract handle(
    interaction: ApplicationCommandInteractionType[T]
  ): Promise<void>;
}

export const ComponentBases = {
  BUTTON: {
    base: MessageButton,
  },
  SELECT_MENU: {
    base: MessageSelectMenu,
  },
  MODAL: {
    base: Modal,
  },
};

export type ComponentTypes = typeof ComponentBases & {
  BUTTON: {
    interaction: ButtonInteraction<'cached'>;
  };
  SELECT_MENU: {
    interaction: SelectMenuInteraction<'cached'>;
  };
  MODAL: {
    interaction: ModalSubmitInteraction<'cached'>;
  };
};

export interface WithHandlerClassType<T extends keyof ComponentTypes> {
  customId: string;
  handle(interaction: ComponentTypes[T]['interaction']): Promise<void>;
}
