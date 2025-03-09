const {
  Client,
  GatewayIntentBits,
  ActivityType,
  REST,
  Routes,
  SlashCommandBuilder,
  InteractionType,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});
require("dotenv").config();

//機密情報取得
const discord_token = process.env.token;

///////////////////////////////////////////////////
// コマンド定義
client.commands = [];
let ping = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("this is ping command.");
let test = new SlashCommandBuilder()
  .setName("test")
  .setDescription("this is test command from single file slash command.");
client.commands.push(ping);
client.commands.push(test);

///////////////////////////////////////////////////
client.on("ready", () => {
  const rest = new REST({ version: "10" }).setToken(process.env.token);
  (async () => {
    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: await client.commands,
      });
      console.log("スラッシュコマンドの再読み込みに成功しました。");
    } catch (err) {
      console.log(
        `❌ スラッシュコマンドの再読み込み時にエラーが発生しました。：\n${err}`
      );
    }
  })();

  console.log(`${client.user.username}への接続に成功しました。`);

  //カスタマイズアクティビティを設定
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は${
        client.guilds.cache.size
      }｜このサーバーが利用しているシャードは${
        Number(client?.shard?.ids) + 1 ? Number(client?.shard?.ids) + 1 : "1"
      }`,
      type: ActivityType.Listening,
    });
  }, 10000);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction?.guild) {
      return interaction?.reply({
        content:
          "❌ このBOTはサーバー内でのみ動作します。\nお手数をおかけしますが、サーバー内でご利用ください。",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      if (interaction?.type == InteractionType.ApplicationCommand) {
        for (let i = 0; i < client.commands.length; i++) {
          if (interaction.commandName == client.commands[i].name) {
            await interaction.reply(`this is ${interaction.commandName}`);
          }
        }
      }

      if (interaction?.type == InteractionType.MessageComponent) {
        await interaction.reply(`customID: ${interaction?.customId}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

client.login(discord_token);
