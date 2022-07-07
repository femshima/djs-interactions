import { Client, GuildResolvable, Interaction } from 'discord.js';
import {
  ApplicationCommandInteractionType,
  ApplicationCommandBase,
  ComponentBases,
  ComponentTypes,
  WithHandlerClassType,
} from './bases';
import crypto from 'crypto';
import { DataStore, DefaultDataStore } from './store';

export default class InteractionFrame {
  constructor(
    private commands: DataStore<
      keyof ApplicationCommandInteractionType,
      string,
      ApplicationCommandBase<keyof ApplicationCommandInteractionType>
    > = new DefaultDataStore(),
    private components: DataStore<
      keyof ComponentTypes,
      string,
      WithHandlerClassType<keyof ComponentTypes>
    > = new DefaultDataStore()
  ) {}
  async interactionCreate(interaction: Interaction) {
    if (!interaction.inCachedGuild()) return;

    const callCommandHandler = <
      T extends keyof ApplicationCommandInteractionType
    >(
      type: T,
      interaction: ApplicationCommandInteractionType[T]
    ) => {
      const command = this.commands.get(type, interaction.commandName);
      if (!command?.handle) return;
      return command.handle(interaction);
    };

    const callComponentHandler = <T extends keyof ComponentTypes>(
      type: T,
      interaction: ComponentTypes[T]['interaction']
    ) => {
      if (!interaction.customId) return;
      const component = this.components.get(type, interaction.customId);
      if (!component?.handle) return;
      return component.handle(interaction);
    };

    if (interaction.isCommand())
      await callCommandHandler('CHAT_INPUT', interaction);
    else if (interaction.isMessageContextMenu())
      await callCommandHandler('MESSAGE', interaction);
    else if (interaction.isUserContextMenu())
      await callCommandHandler('USER', interaction);

    if (interaction.isButton())
      await callComponentHandler('BUTTON', interaction);
    else if (interaction.isSelectMenu())
      await callComponentHandler('SELECT_MENU', interaction);
    else if (interaction.isModalSubmit())
      await callComponentHandler('MODAL', interaction);
  }
  async registerCommand(
    client: Client<true>,
    commands: ApplicationCommandBase<keyof ApplicationCommandInteractionType>[],
    guilds?: GuildResolvable[]
  ) {
    commands.forEach((command) => {
      const def = command.definition;
      const type = def.type ?? 'CHAT_INPUT';
      this.commands.set(type, def.name, command);
    });

    const defs = this.commands.map((_k1, _k2, command) => command.definition);
    if (guilds) {
      for (const guild of guilds) {
        const guildId = client.guilds.resolveId(guild);
        if (!guildId) continue;
        await client.application?.commands.set(defs, guildId);
      }
    } else {
      await client.application?.commands.set(defs);
    }
  }
  baseComponent<T extends keyof ComponentTypes>(base: T) {
    const components = this.components;
    class WithHandler
      extends ComponentBases[base].base
      implements WithHandlerClassType<T>
    {
      customId = '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        super(...args);
        this.customId = crypto.randomUUID() + (this.customId ?? '');
        components.set(base, this.customId, this);
      }
      async handle?(
        interaction: ComponentTypes[T]['interaction']
      ): Promise<void>;
    }
    return WithHandler as {
      new (
        ...args: ConstructorParameters<ComponentTypes[T]['base']>
      ): WithHandler & InstanceType<ComponentTypes[T]['base']>;
    };
  }
}
