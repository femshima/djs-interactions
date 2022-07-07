import { Client, Intents } from 'discord.js';
import env from './env';
import * as Command from './command';
import { interactionFrame } from './interaction';

const { BOT_TOKEN } = env;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

client.on('interactionCreate', (interaction) =>
  interactionFrame.interactionCreate(interaction)
);

client.login(BOT_TOKEN).then(async () => {
  if (!env.production) {
    await interactionFrame.registerCommand(
      client,
      Object.values(Command).map((c) => new c())
    );
  } else {
    await interactionFrame.registerCommand(
      client,
      Object.values(Command).map((c) => new c()),
      (await client.guilds.fetch()).map((v) => v.id)
    );
  }
  console.log('Command initialized!');
});
