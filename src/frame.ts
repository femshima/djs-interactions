import { Client, Collection, Interaction, Snowflake } from 'discord.js';
import { Button, Command, SelectMenu, Modal, ContextMenu } from './bases';

export default class InteractionFrame {
  private commands: Collection<string, Command> = new Collection();
  private contextmenus: Collection<string, ContextMenu> = new Collection();
  private buttons: Collection<string, Button> = new Collection();
  private selectmenus: Collection<string, SelectMenu> = new Collection();
  private modals: Collection<string, Modal> = new Collection();
  constructor(public client: Client) {
    client.on('interactionCreate', this.interaction.bind(this));
  }
  private async interaction(interaction: Interaction) {
    if (!interaction.inCachedGuild()) return;
    if (interaction.isCommand()) {
      await this.commands.get(interaction.commandName)?.handle(interaction);
    } else if (interaction.isAutocomplete()) {
      const cmd = this.commands.get(interaction.commandName);
      if (typeof cmd?.autocomplete === 'function') {
        await cmd.autocomplete(interaction);
      }
    } else if (interaction.isButton()) {
      await this.buttons.get(interaction.customId)?.handle(interaction);
    } else if (interaction.isSelectMenu()) {
      await this.selectmenus.get(interaction.customId)?.handle(interaction);
    } else if (interaction.isModalSubmit()) {
      await this.modals.get(interaction.customId)?.handle(interaction);
    } else if (interaction.isContextMenu()) {
      await this.contextmenus.get(interaction.commandName)?.handle(interaction);
    }
  }
  async registerCommand(
    guildId: undefined | Snowflake,
    ...commands: (Command | ContextMenu)[]
  ) {
    commands.forEach((command) => {
      if (command instanceof Command) {
        this.commands.set(command.definition.name, command);
      } else if (command instanceof ContextMenu) {
        this.contextmenus.set(command.definition.name, command);
      }
    });
    if (guildId) {
      await this.client.application?.commands.set(
        this.commands.map((command) => command.definition),
        guildId
      );
    } else {
      await this.client.application?.commands.set(
        this.commands.map((command) => command.definition)
      );
    }
  }
  registerComponent(...components: (Button | SelectMenu | Modal)[]) {
    components.forEach((component) => {
      if (component instanceof Button)
        this.buttons.set(component.definition.customId, component);
      else if (component instanceof SelectMenu)
        this.selectmenus.set(component.definition.customId, component);
      else if (component instanceof Modal)
        this.modals.set(component.definition.customId, component);
    });
    return components.map((component) => component.definition);
  }
}
