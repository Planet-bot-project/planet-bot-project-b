const http = require("http");
http
	.createServer(function (req, res) {
		res.write("tc_create.js is active.\nPlease check it.");
		res.end();
	})
	.listen(8080);

// Discord bot implements
const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});
require("dotenv").config({ quiet: true });
const prefix = "pj!";
const token = process.env.token;

// botが準備できれば発動され、 上から順に処理される。
client.on("clientReady", () => {
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
client.on("messageCreate", (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(" ");
	const command = args.shift().toLowerCase();

	if (command === "help") {
		message.channel.send({
			embeds: [
				{
					title: "HELP",
					description: "ないよう",
					color: 0x227fff,
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
	} else if (command === "tc_create") {
		const CH_name = message.content.split(" ").slice(1).join(" ");
		if (!CH_name) {
			message.channel.send(
				"エラー:空白がないまたはチャンネル名を書いていません"
			);
		} else if (CH_name.length - 1 >= 100) {
			message.channel.send("エラー：チャンネル名が長すぎます！");
		} else {
			let ct = message.channel.parent;
			message.guild.channels
				.create({
					name: CH_name,
					type: ChannelType.GuildText,
					parent: ct.id,
					topic: "ちゃんえる　とぴっく",
				})
				.then(async (channels) => {
					message.channel.send(`${channels}を作ったよ！`);
					channels.send(`${channels.name}へようこそ！！！！`);
				});
		}
	}
});

// botログイン
client.login(token);
