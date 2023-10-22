const http = require('http');
http.createServer(function(req, res) {
  res.write('.database.js is active.\nPleace check it.');
  res.end();
}).listen(8080);

const Discord = require('discord.js');
const client = new Discord.Client()
const mongo = require("aurora-mongo");
mongo.connect(process.env['db']) //環境変数dbにmongokey(mongodb+srv://ユーザー名:パスワード@cluster0.agxfo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority)を入れる
const token = process.env['token'] //環境変数tokenにBOTtokenを入れる
const kane = new mongo.Database("okane")
const mono = new mongo.Database("mono")
let syouhin = ["クッキー", "AV"];
let nedan = ["100", "1000"];
client.on('message', async message => {
  if (message.content == "!coin") {
    if (await kane.has(message.author.id)) {
      const authorkane = await kane.get(message.author.id)
      console.log(authorkane)
      let tuikanokane = 100
      await kane.set(message.author.id, authorkane + tuikanokane)
      message.reply(`お金を${tuikanokane}円追加しました\n現在の所持金は${authorkane + tuikanokane}円です`)
    } else {
      await kane.set(message.author.id, 0)
      await mono.set(message.author.id, "なし")
      message.reply("ユーザー情報がなかったから追加したよ!")
    }
  }
  if (message.content == "!big_coin") {
    if (await kane.has(message.author.id)) {
      const authorkane = await kane.get(message.author.id)
      console.log(authorkane)
      let tuikanokane = 10000
      await kane.set(message.author.id, authorkane + tuikanokane)
      message.reply(`お金を${tuikanokane}円追加しました\n現在の所持金は${authorkane + tuikanokane}円です`)
    } else {
      await kane.set(message.author.id, 0)
      await mono.set(message.author.id, "なし")
      message.reply("ユーザー情報がなかったから追加したよ!")
    }
  }
  if (message.content == "!shop") {
    message.reply(`商品リスト\n${String(syouhin).split(",").join("\n")}\n値段\n${String(nedan).split(",").join("\n")}`)
  }
  if (message.content == "!お金リセット") {
    if (await kane.has(message.author.id)) {
      await kane.set(message.author.id, 0)
      message.reply("お金をリセットしたよ")
    }
  }
  if (message.content.startsWith("!buy")) {
    if (await kane.has(message.author.id)) {
      const args = message.content.split(" ")[1];
      if (!args) return message.reply("商品番号を入れてね");
      const kaumono = syouhin[args]
      const harau = nedan[args]
      const authorgenkin = await kane.get(message.author.id)
      if (authorgenkin >= harau) {
        await kane.set(message.author.id, authorgenkin - harau)
        await mono.set(message.author.id, kaumono)
        message.reply(`商品${kaumono}を${harau}円で買いました`)
      } else {
        message.reply("お金が足りないよ！")
      }
    } else {
      message.reply("お金がないよ")
    }
  }
  if (message.content == "!所持品") {
    if (await kane.has(message.author.id)) {
      const motimono = await mono.get(message.author.id)
      const syozikin = await kane.get(message.author.id)
      message.reply(`お金は${syozikin || "0"}円持ち物は${motimono || "なんもない"}`)
    }
  }
})
client.login(token);