const channel_name = "β-botテスト"; //channel_nameのチャンネルだけにbotは反応する

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
require("dotenv").config();
const token = process.env.token;

const { Worker } = require("worker_threads");
let worker = new Worker("./TeX2image_worker.js");

async function worker_on_msg(obj) {
  if (obj.msg === "") {
    client.channels.cache
      .find((ch) => ch.name === channel_name)
      ?.send({ files: ["./" + obj.name] });
  } else {
    client.channels.cache
      .find((ch) => ch.name === channel_name)
      ?.send(obj.msg.toString());
  }
}

worker.on("message", worker_on_msg);

client.on("ready", () => {
  console.log(`${client.user.tag} でログインしています。`);
});

client.on("messageCreate", async (msg) => {
  if (msg.channel.name !== channel_name) return;
  if (msg.content === "!!ping") {
    msg.reply("Pong!");
  } else if (msg.content === "!!destroy") {
    worker.terminate();
    client.destroy();
  } else if (msg.content === "!!help") {
    client.channels.cache
      .find((ch) => ch.name === channel_name)
      ?.send(
        "> 〇このbot is 何？\n" +
          "> TeX記法で書かれた文字列から画像を生成するbotです。\n\n" +
          "> 〇使用方法\n" +
          "> botがオンライン時にコマンドを打ち込むと、コマンドに対応した動作をします。\n\n" +
          "> 〇コマンド一覧\n> \n" +
          "> ・!!ping\n> Pong!と返します。\n> \n" +
          "> ・!!destroy\n> botがログオフします。\n> \n" +
          "> ・!!help\n> コマンド一覧を表示します。\n> \n" +
          "> ・!!TeX filename.type option \\`\\`\\`str\\`\\`\\`\n> TeXという記法で書かれた文字列strからflilename.typeの画像を生成します。typeはsvg,png,jpeg,webpのいずれかです。optionでは背景透過の有無を決めます。flilename.typeとoptionは省略できます。"
      );
  } else {
    //!!TeX filetype option str
    if (msg.content.length >= 5) {
      let posObj = { name: "file.png", type: "png", option: false, str: "" };
      let commands_list = [];
      let ch = msg.content.indexOf("```");
      if (ch === -1) return;
      let i = 0;
      while (ch > i) {
        let j = msg.content.indexOf(" ", i);
        if (j === -1) break;
        commands_list.push(msg.content.substring(i, j));
        i = j + 1;
      }
      commands_list.push("");

      i = 0;
      let len = commands_list.length - 1;
      if (i > len) return;
      if (commands_list[i] !== "!!TeX") return;

      i++;
      if (i > len) msg.reply("command error");
      if (commands_list[i].indexOf(".svg") !== -1) {
        posObj.name = commands_list[i];
        posObj.type = "svg";
        i++;
      } else if (commands_list[i].indexOf(".png") !== -1) {
        posObj.name = commands_list[i];
        posObj.type = "png";
        i++;
      } else if (commands_list[i].indexOf(".jpeg") !== -1) {
        posObj.name = commands_list[i];
        posObj.type = "jpeg";
        i++;
      } else if (commands_list[i].indexOf(".webp") !== -1) {
        posObj.name = commands_list[i];
        posObj.type = "webp";
        i++;
      }

      if (i > len) msg.reply("command error");
      if (commands_list[i] === "true") {
        posObj.option = true;
        i++;
      } else if (commands_list[i] === "false") {
        posObj.option = false;
        i++;
      }

      if (posObj.type === "jpeg" && posObj.option === true)
        posObj.option = false;

      len = msg.content.length;
      ch += 3;
      i = msg.content.indexOf("```", ch);
      if (i === -1) msg.reply("command error");
      posObj.str = msg.content.substring(ch, i);

      worker.postMessage(posObj);
    }
  }
});

//ログイン
client.login(token);
