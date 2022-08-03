import { Command } from '../../../src';
import Admin from './admin';
import Langs from './langs';
import Locale from './locales';

export default class Greet extends Command {
  definition = {
    name: 'greet',
    description: 'Commands about greetings',
    options: [new Langs(), new Locale(), new Admin()],
  };
}
