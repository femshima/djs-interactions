import { Client, GuildResolvable, Interaction } from 'discord.js';
import {
  ApplicationCommandBase,
  Commands,
  Components,
  Ctor,
  DataTypes,
  InteractionBases,
  InteractionTypes,
  isCommand,
  isComponent,
  register,
  WithHandlerClassType,
} from './bases';
import crypto from 'crypto';
import { DataStore, DefaultDataStore } from './store';

export default class InteractionFrame {
  store: DataStore<keyof InteractionTypes, string, DataTypes>;
  constructor(options?: {
    store: DataStore<keyof InteractionTypes, string, DataTypes>;
  }) {
    this.store =
      options?.store ??
      new DefaultDataStore<keyof InteractionTypes, string, DataTypes>();
  }
  async interactionCreate(interaction: Interaction) {
    if (!interaction.inCachedGuild()) return;

    if (interaction.isCommand())
      await this.store
        .get('CHAT_INPUT', interaction.commandName)
        ?.handle(interaction);
    else if (interaction.isMessageContextMenu())
      await this.store
        .get('MESSAGE', interaction.commandName)
        ?.handle(interaction);
    else if (interaction.isUserContextMenu())
      await this.store
        .get('USER', interaction.commandName)
        ?.handle(interaction);

    if (interaction.isButton())
      await this.store
        .get('BUTTON', interaction.customId)
        ?.handle?.(interaction);
    else if (interaction.isSelectMenu())
      await this.store
        .get('SELECT_MENU', interaction.customId)
        ?.handle?.(interaction);
    else if (interaction.isModalSubmit())
      await this.store
        .get('MODAL', interaction.customId)
        ?.handle?.(interaction);
  }
  async registerCommand(
    client: Client<true>,
    commands: ApplicationCommandBase<typeof Commands[number]>[],
    guilds?: GuildResolvable[]
  ) {
    commands.forEach((command) => {
      command[register](this.store);
    });

    const defs = this.store
      .map((_k1, _k2, command) =>
        'definition' in command ? command.definition : undefined
      )
      .filter(
        (v): v is Exclude<typeof v, undefined> => typeof v !== 'undefined'
      );

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

  Base<T extends typeof Commands[number]>(base: T): Ctor<T>;
  Base<T extends typeof Components[number]>(base: T): Ctor<T>;
  Base<T extends keyof InteractionTypes>(base: T) {
    if (isCommand(base)) {
      return InteractionBases[base];
    } else if (isComponent(base)) {
      return this.ComponentBase(base);
    }
  }

  private ComponentBase<T extends typeof Components[number]>(base: T) {
    const store = this.store;
    return class WithHandler
      extends InteractionBases[base]
      implements WithHandlerClassType<T>
    {
      customId = '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        super(...args);
        this.customId = crypto.randomUUID() + (this.customId ?? '');
        store.set(base, this.customId, this as DataTypes[T]);
      }
      async handle?(interaction: InteractionTypes[T]): Promise<void>;
    };
  }
}
