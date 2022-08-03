import {
  Client,
  ComponentBuilder,
  GuildResolvable,
  Interaction,
} from 'discord.js';
import {
  ApplicationCommandBase,
  CallIfMatches,
  Commands,
  ComponentDataType,
  ComponentParamType,
  Components,
  Ctor,
  DataParser,
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
    class WithHandler implements WithHandlerClassType<T> {
      readonly type = base;
      data: ComponentDataType[T];
      constructor(data: ComponentParamType<T>) {
        this.data = DataParser[base](data, store.getUniqueKey());
        if ('custom_id' in this.data) {
          // unsafe typescript: The `type` property's type does not match somehow...
          store.set(this.data.custom_id, this as unknown as DataTypes[T]);
        }
      }
      async handle?(interaction: InteractionTypes[T]): Promise<void>;
      toJSON() {
        return this.data;
      }
    }
    // this is necessary for discord.js to treat WithHandler as ComponentBuilder,
    // urging it to call toJSON().
    Object.setPrototypeOf(WithHandler.prototype, ComponentBuilder.prototype);
    return WithHandler;
  }
}
