const http = require("http");
http
  .createServer(function (req, res) {
    res.write("example.js is active.\nPlease check it.");
    res.end();
  })
  .listen(8080);

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
require("dotenv").config();

//起動確認
client.once("ready", () => {
  console.log(`${client.user.tag} Ready`);
});

//返答
client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content == "hi") {
    message.guild.scheduledEvents.fetch().then((events) => {
      events.forEach((event) => {
        if (event.status == 2) {
          console.log(event);
        }
      });
    });
  }
});

//Discordへの接続
const token = process.env.TOKEN;
client.login(token);
