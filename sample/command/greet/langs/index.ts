import { ApplicationCommandOptionType } from 'discord.js';
import { SubCommandGroup, SubCommandGroupDefinition } from '../../../../src';
import En from './en';
import Ja from './ja';

export default class Langs extends SubCommandGroup {
  definition: SubCommandGroupDefinition = {
    type: ApplicationCommandOptionType.SubcommandGroup,
    name: 'langs',
    description: 'Greetings',
    options: [new En(), new Ja()],
  };
}
