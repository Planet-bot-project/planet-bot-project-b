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
  ActionRowBuilder,
  AttachmentBuilder,
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
                url: "attachment://logo.png",
              },
            })
          )
      )
      .addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
          new MediaGalleryItemBuilder({ media: { url: "attachment://1.png" } }),
          new MediaGalleryItemBuilder({ media: { url: "attachment://2.png" } }),
          new MediaGalleryItemBuilder({ media: { url: "attachment://3.png" } }),
          new MediaGalleryItemBuilder({ media: { url: "attachment://4.png" } }),
          new MediaGalleryItemBuilder({ media: { url: "attachment://5.png" } })
        )
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          // 仕切り線を表示するか(デフォルト: true)
          .setDivider(true)
          // 仕切り線の前後の余白の大きさを設定
          .setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder({
          content: "## 添付ファイルを途中に載せる事も出来ます！",
        })
      )
      .addFileComponents(
        new FileBuilder({ file: { url: "attachment://discord.svg" } })
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          // 仕切り線を表示するか(デフォルト: true)
          .setDivider(true)
          // 仕切り線の前後の余白の大きさを設定
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
            // ここは、行内にボタンを配置するものなので、ボタンは１つのみ設定可能
            new ButtonBuilder()
              .setCustomId("button1")
              .setLabel("了承！")
              .setStyle(ButtonStyle.Primary)
          )
      )

      .addActionRowComponents(
        // 1メッセージ無いのbuttonのカスタムIDは一意であるひつようがあるので、先ほどの「button1」は使えない。
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("button2")
            .setLabel("緑！")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("button3")
            .setLabel("赤！")
            .setStyle(ButtonStyle.Danger)
        )
      )

      // ↓旧embedのcolorの部分
      .setAccentColor(0xff0000)
      // ↓埋め込みに対してスポイラー
      .setSpoiler(false);

    let attachments = [
      new AttachmentBuilder().setFile("images/logo.png").setName("logo.png"),
      new AttachmentBuilder().setFile("images/1.png").setName("1.png"),
      new AttachmentBuilder().setFile("images/2.png").setName("2.png"),
      new AttachmentBuilder().setFile("images/3.png").setName("3.png"),
      new AttachmentBuilder().setFile("images/4.png").setName("4.png"),
      new AttachmentBuilder().setFile("images/5.png").setName("5.png"),
      new AttachmentBuilder()
        .setFile("images/discord-mark-white.svg")
        .setName("discord.svg"),
    ];

    message.channel.send({
      components: [components],
      files: attachments,
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
