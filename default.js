const http = require('http');
http.createServer(function(req, res) {
  res.write('default.js is active.\nPleace check it.');
  res.end();
}).listen(8080);

// Discord bot implements
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
const prefix = 'pj!';
const token = process.env.TOKEN;

// botが準備できれば発動され、 上から順に処理される。
client.on("ready", () => {
  // コンソールにReady!!と表示
  console.log("Ready!!");

  // ステータスを設定する
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜　Ping値は、${client.ws.ping}msです`
    })
  }, 10000)
  client.channels.cache.get("889486664760721418").send("起動しました！");

  // readyイベントここまで
});

// botがメッセージを受信すると発動され、 上から順に処理される。
client.on('messageCreate',async message => {
  // メッセージの本文が about だった場合
  if (message.content.startsWith(`${prefix}about`)) {
    message.channel.send({
      embeds: [
        {
          title: "Planet bot β (JS)について",
          description: "node.jsで作成された、BOT開発テスト用のbotです。",
          color: 3823616,
          timestamp: new Date(),
          thumbnail: {
            url: 'attachment://logo.png'
          },
          footer: {
            text: 'This bot is made by Hoshimikan6490',
            icon_url: 'attachment://me.png',
          }
        }
      ],
      files: [
        {
          attachment: "images/logo.png",
          name: "logo.png"
        }, {
          attachment: "images/me.png",
          name: "me.png"
        }
      ]
    });
  } else if (message.content.startsWith(`${prefix}hi`)) {
    const help_start = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('support')
          .setLabel('お問い合わせを始める')
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🎫"),
      );  
    //button作る
    await message.channel.send({
      embeds: [
        {
          title: "🎫お問い合わせ🎫",
          description: "質問・要望・バグ報告がある場合は下のボタンを押してください。\nサポートチームが対応いたします。",
          color: 0x00eaff,
          footer: {
            text: '↓ここをクリックして始めてください↓'
          }
        }
      ],
      components: [help_start]
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === "support") {
    await interaction.channel.send("hi!!!");
  }
});

// botログイン
client.login(token);