const http = require('http');
http
	.createServer((req, res) => {
		res.write('day_check.js is active.\nPlease check it.');
		res.end();
	})
	.listen(8080);

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});
require('dotenv').config({ quiet: true });

//起動確認
client.once('clientReady', () => {
	const cron = require('node-cron');

	cron.schedule('30 * * * * *', () => {
		//現在時刻が30秒の時に実行
		console.log('30秒だよ');
	});

	// コンソールにReady!!と表示
	console.log('Ready!!');

	// ステータスを設定する
	setInterval(() => {
		client.user.setActivity({
			name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜ Ping値は、${client.ws.ping}msです`,
		});
	}, 10 * 1000); //10秒おきに実行
	client.channels.cache.get('889486664760721418').send('起動しました！');
});

//Discordへの接続
const token = process.env.token;
client.login(token);
