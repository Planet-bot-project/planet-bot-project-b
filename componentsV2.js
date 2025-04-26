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
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
  SectionBuilder,
  ThumbnailBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  FileBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
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
      .addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
          new MediaGalleryItemBuilder({
            media: {
              url: "https://images-ext-1.discordapp.net/external/xVc_jz0Y4f6HbujyiQ42xdQwynClEjfoOk9FGOoknzg/%3Fv%3D5f3a0a5f/https/i.ytimg.com/vi_webp/axZ9LYMvrPo/maxresdefault.webp?format=webp&width=756&height=426",
            },
          }),
          new MediaGalleryItemBuilder({
            media: {
              url: "https://images-ext-1.discordapp.net/external/VbsiwWkx7xRVXlM9X-fTyEB1-COdscw1QZgqRT4j480/%3Fv%3D67eb9008/https/i.ytimg.com/vi_webp/FVBQM1Y7ukg/maxresdefault.webp?format=webp&width=756&height=426",
            },
          })
        )
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true) //仕切り線を表示するか(デフォルト: true)
          .setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder({
          content: "## 添付ファイルを途中に載せる事も出来ます！",
        })
      )
      .addFileComponents(
        new FileBuilder({ file: { url: "attachment://file.png" } })
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true) //仕切り線を表示するか(デフォルト: true)
          .setSpacing(SeparatorSpacingSize.Large)
      )

      .addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder({
              content: "## どのボタンが好き？",
            })
          )
          .setButtonAccessory(
            new ButtonBuilder()
              .setCustomId("button1")
              .setLabel("緑")
              .setStyle(ButtonStyle.Success)
          )
        //TODO: 複数ボタン対応
      )

      // ↓旧embedのcolorの部分
      .setAccentColor(0xff0000)
      // ↓埋め込みに対してスポイラー
      .setSpoiler(false);

    message.channel.send({
      components: [components],
      files: [
        {
          attachment: "images/logo.png",
          name: "file.png",
        },
      ],
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
