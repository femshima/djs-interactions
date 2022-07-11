import { Client, GuildResolvable, Interaction } from 'discord.js';
import {
  ApplicationCommandBase,
  CallIfMatches,
  Commands,
  Components,
  Ctor,
  DataTypes,
  InteractionBases,
  InteractionTypes,
  isCommand,
  isComponent,
  isT,
  WithHandlerClassType,
} from './bases';
import { DataStore, DefaultDataStore } from './store';

export default class InteractionFrame<
  T extends DataStore<
    string,
    DataTypes[keyof InteractionTypes]
  > = DefaultDataStore<DataTypes[keyof InteractionTypes]>
> {
  store: T;
  constructor(options: { store: T }) {
    this.store = options?.store;
  }
  async interactionCreate(interaction: Interaction) {
    if (!interaction.inCachedGuild()) return;

    const i = interaction as Interaction & {
      commandName?: string;
      customId?: string;
    };
    const key = i.commandName || i.customId;
    if (!key) return;
    const value = await this.store.get(key);
    if (!value) return;
    await CallIfMatches(value, interaction);
  }

  async registerCommand(options: {
    client: Client<true>;
    commands: ApplicationCommandBase<typeof Commands[number]>[];
    guilds?: boolean | GuildResolvable[];
  }) {
    const { client, commands } = options;
    const guilds =
      options.guilds === true
        ? (await client.guilds.fetch()).map((v) => v.id)
        : options.guilds;

    await Promise.all(
      commands.map((command) => {
        return this.store.set(command.definition.name, command);
      })
    );

    const defs = (await this.store.values())
      .map((v) => {
        if (isT('CHAT_INPUT', v) || isT('MESSAGE', v) || isT('USER', v)) {
          return v.definition;
        }
      })
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
        this.customId = store.getUniqueKey();
        store.set(this.customId, this as DataTypes[T]);
      }
      async handle?(interaction: InteractionTypes[T]): Promise<void>;
    };
  }
}
