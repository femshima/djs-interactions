import {
  ButtonInteraction,
  SelectMenuInteraction,
  ModalSubmitInteraction,
  CommandInteraction,
  Interaction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import AbortError from '../error/AbortError';
import {
  ApplicationCommandBase,
  Commands,
  InteractionBases,
} from './ApplicationCommand';
import {
  ComponentParamType,
  Components,
  WithHandlerClassType,
} from './Components';
import { SubCommand, SubCommandGroup } from './SubCommand';

export * from './ApplicationCommand';
export * from './Components';
export * from './SubCommand';

export interface InteractionTypes {
  CHAT_INPUT: CommandInteraction<'cached'>;
  MESSAGE: MessageContextMenuCommandInteraction<'cached'>;
  USER: UserContextMenuCommandInteraction<'cached'>;
  BUTTON: ButtonInteraction<'cached'>;
  SELECT_MENU: SelectMenuInteraction<'cached'>;
  MODAL: ModalSubmitInteraction<'cached'>;
}

type DataType<T extends keyof InteractionTypes> =
  T extends typeof Commands[number]
    ? ApplicationCommandBase<T>
    : T extends typeof Components[number]
    ? WithHandlerClassType<T>
    : never;

export type DataTypes = {
  [k in keyof InteractionTypes]: DataType<k>;
};

type ConstructorParams<T extends keyof InteractionTypes> =
  T extends typeof Commands[number]
    ? ConstructorParameters<typeof InteractionBases[T]>
    : T extends typeof Components[number]
    ? [data: ComponentParamType<T>]
    : never;

export interface Ctor<T extends keyof InteractionTypes> {
  new (...args: ConstructorParams<T>): DataTypes[T];
}

export function isT<T extends keyof InteractionTypes>(
  type: T,
  target: unknown
): target is DataType<T> {
  const arg = target as { type?: string };
  return type === (arg.type ?? 'CHAT_INPUT');
}

export async function CallIfMatches(
  target: DataType<keyof InteractionTypes>,
  interaction: Interaction<'cached'>
) {
  if (interaction.isChatInputCommand() && isT('CHAT_INPUT', target)) {
    try {
      await target.handle?.(interaction);
      const handlers = target.definition.options
        ?.map((o) => {
          if (
            o instanceof SubCommand &&
            o.definition.name === interaction.options.getSubcommand()
          ) {
            return o;
          } else if (
            o instanceof SubCommandGroup &&
            o.definition.name === interaction.options.getSubcommandGroup()
          ) {
            const subcommands = o.definition.options?.filter(
              (o): o is SubCommand => {
                if (o instanceof SubCommand)
                  return (
                    o.definition.name === interaction.options.getSubcommand()
                  );
                return false;
              }
            );
            return [o, ...(subcommands ?? [])];
          }
        })
        .flat();
      if (!handlers) return;
      for (const subcommand of handlers) {
        await subcommand?.handle?.(interaction);
      }
    } catch (e) {
      if (e instanceof AbortError) {
        return;
      } else if (e instanceof Error) {
        throw new Error('ChatInput interaction handler throwed an error.', {
          cause: e,
        });
      } else {
        throw e;
      }
    }
  } else if (
    interaction.isMessageContextMenuCommand() &&
    isT('MESSAGE', target)
  ) {
    return target.handle!(interaction);
  } else if (interaction.isUserContextMenuCommand() && isT('USER', target)) {
    return target.handle!(interaction);
  } else if (interaction.isButton() && isT('BUTTON', target)) {
    return target.handle?.(interaction);
  } else if (interaction.isSelectMenu() && isT('SELECT_MENU', target)) {
    return target.handle?.(interaction);
  } else if (interaction.isModalSubmit() && isT('MODAL', target)) {
    return target.handle?.(interaction);
  }
}
