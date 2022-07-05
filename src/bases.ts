import {
  ApplicationCommandData,
  AutocompleteInteraction,
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Interaction,
  MessageButton,
  MessageSelectMenu,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  Modal as DiscordModal,
  ModalOptions,
} from 'discord.js';

export abstract class InteractionBase<
  DefinitionType,
  InteractionType extends Interaction
> {
  abstract get definition(): DefinitionType;
  abstract handle(interaction: InteractionType): void | Promise<void>;
}

export abstract class Command extends InteractionBase<
  ApplicationCommandData & { type: 'CHAT_INPUT' },
  CommandInteraction<'cached'>
> {
  autocomplete?(interaction: AutocompleteInteraction): void | Promise<void>;
}
export abstract class ContextMenu extends InteractionBase<
  ApplicationCommandData & { type: 'USER' | 'MESSAGE' },
  ContextMenuInteraction<'cached'>
> {}

export abstract class Button extends InteractionBase<
  MessageButton & { customId: string },
  ButtonInteraction<'cached'>
> {}
export abstract class SelectMenu extends InteractionBase<
  MessageSelectMenu & { customId: string },
  SelectMenuInteraction<'cached'>
> {}
export abstract class Modal extends InteractionBase<
  (DiscordModal | ModalOptions) & { customId: string },
  ModalSubmitInteraction<'cached'>
> {}
