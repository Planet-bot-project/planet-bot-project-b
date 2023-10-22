const http = require('http');
http.createServer(function(req, res) {
  res.write('yt_search.js is active.\nPleace check it.');
  res.end();
}).listen(8080);

// Discord bot implements
const yts = require( 'yt-search' );//yt-searchを読み込む
const { Client, GatewayIntentBits } = require('discord.js');
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
client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    message.channel.send({
      embeds: [{
        title: "HELP",
        description: "ないよう",
        color: 0x227fff,
        timestamp: new Date(),
        thumbnail: {
          url: 'attachment://logo.png'
        },
        footer: {
          text: 'This bot is made by Hoshimikan6490',
          icon_url: 'attachment://me.png',
        },
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
    })
  } else if (command === "yt_search") {
    const AKB = message.content.split(" ").slice(1).join(" ")
    if (!AKB) return message.channel.send("エラー:空白がないまたは検索内容を書いていません");
    yts( AKB, function ( err, r ) {//検索
    const videos = r.videos;
    const playlists = r.playlists || r.lists;
    const channels = r.channels || r.accounts;
    message.channel.send(videos[ 0 ].url );
    })
  }
})


// botログイン
client.login(token);