import { Client, GatewayIntentBits } from 'discord.js';
import env from './env';
import * as Command from './command';
import * as ContextMenu from './contextmenu';
import { frame } from '../src';

const { BOT_TOKEN } = env;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on('interactionCreate', (interaction) =>
  frame.interactionCreate(interaction)
);

client.login(BOT_TOKEN).then(async () => {
  await frame.registerCommand({
    client,
    commands: [
      ...Object.values(Command).map((c) => new c()),
      ...Object.values(ContextMenu).map((c) => new c()),
    ],
    guilds: !env.production,
  });
  console.log('Command initialized!');
});
