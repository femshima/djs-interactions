import { Client, Intents } from 'discord.js';
import env from './env';
import * as Command from './command';
import { frame } from '../src';

const { BOT_TOKEN } = env;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

client.on('interactionCreate', (interaction) =>
  frame.interactionCreate(interaction)
);

client.login(BOT_TOKEN).then(async () => {
  await frame.registerCommand({
    client,
    commands: Object.values(Command).map((c) => new c()),
    guilds: !env.production,
  });
  console.log('Command initialized!');
});
