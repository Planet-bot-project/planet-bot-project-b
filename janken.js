const http = require("http");
http
  .createServer(function (req, res) {
    res.write("janken.js is active.\nPlease check it.");
    res.end();
  })
  .listen(8080);

// Discord bot implements
const {
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
require("dotenv").config();
const prefix = "pj!";
const token = process.env.token;
const util = require("util");
const wait = util.promisify(setTimeout);

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

  if (command === "janken") {
    const janken_choice = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("pa")
        .setLabel("パー")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🖐"),
      new ButtonBuilder()
        .setCustomId("cho")
        .setLabel("チョキ")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✌"),
      new ButtonBuilder()
        .setCustomId("gu")
        .setLabel("グー")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("✊")
    );
    const replay = await message.channel.send({
      embeds: [
        {
          title: "↓何を出す？！↓",
          color: 0xff0000,
          thumbnail: {
            url: "https://3.bp.blogspot.com/-cPqdLavQBXA/UZNyKhdm8RI/AAAAAAAASiM/NQy6g-muUK0/s400/syougatsu2_omijikuji2.png",
          },
        },
      ],
      components: [janken_choice],
    });

    await wait(6000);
    replay.delete();
  }
});

client.on("interactionCreate", async (interaction) => {
  // じゃんけんの処理
  if (
    interaction.customId === "pa" ||
    interaction.customId === "cho" ||
    interaction.customId === "gu"
  ) {
    const wait = require("node:timers/promises").setTimeout;
    await interaction.deferReply();
    // じんべえの手を決める
    const arr = ["pa", "cho", "gu"];
    const random = Math.floor(Math.random() * arr.length);
    const jinbe = arr[random];
    // 自分の手を「me」に代入
    if (interaction.customId === "pa") {
      var me = "pa";
    } else if (interaction.customId === "cho") {
      var me = "cho";
    } else if (interaction.customId === "gu") {
      var me = "gu";
    }
    // 結果判定
    // 自分がパーの時
    if (interaction.customId === "pa") {
      if (jinbe === "pa") {
        var jan_result = "aiko";
      } else if (jinbe === "cho") {
        var jan_result = "lose";
      } else if (jinbe === "gu") {
        var jan_result = "win";
      }
      // 自分がチョキの時
    } else if (interaction.customId === "cho") {
      if (jinbe === "pa") {
        var jan_result = "win";
      } else if (jinbe === "cho") {
        var jan_result = "aiko";
      } else if (jinbe === "gu") {
        var jan_result = "lose";
      }
    } else if (interaction.customId === "gu") {
      // 自分がグーの時
      if (jinbe === "pa") {
        var jan_result = "lose";
      } else if (jinbe === "cho") {
        var jan_result = "win";
      } else if (jinbe === "gu") {
        var jan_result = "aiko";
      }
    }
    // 変数調整
    //me変数の日本語化
    if (me === "pa") {
      var result_me = "パー";
    } else if (me === "cho") {
      var result_me = "チョキ";
    } else if (me === "gu") {
      var result_me = "グー";
    }
    //jinbe変数の日本語化
    if (jinbe === "pa") {
      var result_jinbe = "パー";
    } else if (jinbe === "cho") {
      var result_jinbe = "チョキ";
    } else if (jinbe === "gu") {
      var result_jinbe = "グー";
    }
    //結果の日本語化
    if (jan_result === "win") {
      var result_jinbe_jp = "あなたの勝ち";
    } else if (jan_result === "aiko") {
      var result_jinbe_jp = "あいこ";
    } else if (jan_result === "lose") {
      var result_jinbe_jp = "あなたの負け";
    }
    // 色調整
    if (jan_result === "win") {
      var color = 0xff0000;
    } else if (jan_result === "aiko") {
      var color = 0xffff00;
    } else if (jan_result === "lose") {
      var color = 0x0000ff;
    }
    // file_pass設定
    if (jan_result === "win") {
      var file_pas = "photos/win.png";
    } else if (jan_result === "aiko") {
      var file_pas = "photos/aiko.png";
    } else if (jan_result === "lose") {
      var file_pas = "photos/lose.png";
    }
    // 結果表示
    await interaction.editReply({
      embeds: [
        {
          title: "じゃんけんの結果！",
          description:
            "あなたは " +
            result_me +
            "を出して、\n私は　" +
            result_jinbe +
            "を出したので、\n\n__**" +
            result_jinbe_jp +
            "です！**__",
          color: color,
          thumbnail: {
            url: "attachment://omi_kekka.png",
          },
        },
      ],
      files: [{ attachment: file_pas, name: "omi_kekka.png" }],
    });
  }
});

// botログイン
client.login(token);
