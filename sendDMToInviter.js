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
  PermissionsBitField,
  AuditLogEvent,
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

client.on("guildCreate", async (guild) => {
  let DMuser;
  if (
    guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)
  ) {
    const fetchedLogs = await guild.fetchAuditLogs({
      type: AuditLogEvent.BotAdd,
      limit: 1,
    });
    const inviterInfo = fetchedLogs.entries.first().executor;
    let inviterId = inviterInfo.id;
    DMuser = await client.users.fetch(inviterId);
  } else {
    let owner_id = guild.ownerId;
    DMuser = await client.users.fetch(owner_id);
  }
  console.log(DMuser);
  console.log(`invited user: ${DMuser.globalName}(${DMuser.id})`);
});

// botがメッセージを受信すると発動され、 上から順に処理される。
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command == "about") {
    message.channel.send({
      embeds: [
        {
          title: "Planet bot β (JS)について",
          description: "node.jsで作成された、BOT開発テスト用のbotです。",
          color: 3823616,
          timestamp: new Date(),
          thumbnail: {
            url: "attachment://logo.png",
          },
          footer: {
            text: "This bot is made by Hoshimikan6490",
            icon_url: "attachment://me.png",
          },
        },
      ],
      files: [
        {
          attachment: "images/logo.png",
          name: "logo.png",
        },
        {
          attachment: "images/me.png",
          name: "me.png",
        },
      ],
    });
  }
});

// botログイン
client.login(token);
