const http = require("http");
http
  .createServer(function (req, res) {
    res.write("database.js is active.\nPlease check it.");
    res.end();
  })
  .listen(8080);

const Discord = require("discord.js");
const client = new Discord.Client();
const mongo = require("aurora-mongo");
require("dotenv").config();
mongo.connect(process.env.db); //環境変数dbにmongo_keyを入れる
const token = process.env.token; //環境変数tokenにBOT_tokenを入れる
const kane = new mongo.Database("money");
const mono = new mongo.Database("mono");
let present = ["クッキー", "AV"];
let price = ["100", "1000"];
client.on("message", async (message) => {
  if (message.content == "!coin") {
    if (await kane.has(message.author.id)) {
      const userHavingMoney = await kane.get(message.author.id);
      console.log(userHavingMoney);
      let additionalMoney = 100;
      await kane.set(message.author.id, userHavingMoney + additionalMoney);
      message.reply(
        `お金を${additionalMoney}円追加しました\n現在の所持金は${
          userHavingMoney + additionalMoney
        }円です`
      );
    } else {
      await kane.set(message.author.id, 0);
      await mono.set(message.author.id, "なし");
      message.reply("ユーザー情報がなかったから追加したよ!");
    }
  }
  if (message.content == "!big_coin") {
    if (await kane.has(message.author.id)) {
      const userHavingMoney = await kane.get(message.author.id);
      console.log(userHavingMoney);
      let additionalMoney = 10000;
      await kane.set(message.author.id, userHavingMoney + additionalMoney);
      message.reply(
        `お金を${additionalMoney}円追加しました\n現在の所持金は${
          userHavingMoney + additionalMoney
        }円です`
      );
    } else {
      await kane.set(message.author.id, 0);
      await mono.set(message.author.id, "なし");
      message.reply("ユーザー情報がなかったから追加したよ!");
    }
  }
  if (message.content == "!shop") {
    message.reply(
      `商品リスト\n${String(present).split(",").join("\n")}\n値段\n${String(
        price
      )
        .split(",")
        .join("\n")}`
    );
  }
  if (message.content == "!お金リセット") {
    if (await kane.has(message.author.id)) {
      await kane.set(message.author.id, 0);
      message.reply("お金をリセットしたよ");
    }
  }
  if (message.content.startsWith("!buy")) {
    if (await kane.has(message.author.id)) {
      const args = message.content.split(" ")[1];
      if (!args) return message.reply("商品番号を入れてね");
      const somethingToBuy = present[args];
      const pay = price[args];
      const userHavingMoney = await kane.get(message.author.id);
      if (userHavingMoney >= pay) {
        await kane.set(message.author.id, userHavingMoney - pay);
        await mono.set(message.author.id, somethingToBuy);
        message.reply(`商品${somethingToBuy}を${pay}円で買いました`);
      } else {
        message.reply("お金が足りないよ！");
      }
    } else {
      message.reply("お金がないよ");
    }
  }
  if (message.content == "!所持品") {
    if (await kane.has(message.author.id)) {
      const Belongings = await mono.get(message.author.id);
      const userHavingMoney = await kane.get(message.author.id);
      message.reply(
        `お金は${userHavingMoney || "0"}円持ち物は${Belongings || "なんもない"}`
      );
    }
  }
});
client.login(token);
