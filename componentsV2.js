const http = require("http");
http
  .createServer(function (req, res) {
    res.write("example.js is active.\nPlease check it.");
    res.end();
  })
  .listen(8080);

// Discord bot implements
const {
  Client,
  GatewayIntentBits,
  ComponentBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  ContainerComponent,
  MessageFlags,
  SectionBuilder,
  ThumbnailBuilder,
  ComponentType,
} = require("discord.js");
const { url } = require("inspector");
require("dotenv").config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
const prefix = "pj!";
const token = process.env.token;

// botが準備できれば発動され、 上から順に処理される。
client.on("ready", () => {
  // コンソールにReady!!と表示
  console.log("Ready!!");

  // ステータスを設定する
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜　Ping値は、${client.ws.ping}msです`,
    });
  }, 10000);
  client.channels.cache.get("889486664760721418").send("起動しました！");

  // readyイベントここまで
});

// botがメッセージを受信すると発動され、 上から順に処理される。
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command == "about") {
    let components = new ContainerBuilder()
      .addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents([
            new TextDisplayBuilder({
              content: "# Components V2のテストです",
            }),
            new TextDisplayBuilder({
              content: `これは、Discordの新しいメッセージ表示方法です。TextDisplayは、markdown形式で記述します。
        - 箇条書きも\n- 可能です。`,
            }),
            new TextDisplayBuilder({
              content: `-# もちろん、文字を小さくすることも…`,
            }),
          ])
          .setThumbnailAccessory(
            new ThumbnailBuilder({
              media: {
                url: "https://media.discordapp.net/attachments/980641967694311484/1365540659917750303/maxresdefault.png?ex=680dae57&is=680c5cd7&hm=b6149e18cca077c567eeef895c222584b41d2808342a40be4967069600988547&=&format=webp&quality=lossless&width=756&height=426",
              },
            })
          )
      )

      // ↓旧embedのcolorの部分
      .setAccentColor(0xff0000)
      // ↓埋め込みに対してスポイラー
      .setSpoiler(false);

    message.channel.send({
      components: [components],
      flags: MessageFlags.IsComponentsV2,
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.customId === "support") {
    await interaction.reply("hi!!!");
  }
});

// botログイン
client.login(token);
