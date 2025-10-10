const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
	],
});
const express = require('express');
const app = express();
require('dotenv').config({ quiet: true });

//機密情報取得
const discord_token = process.env.token;
const PORT = 8000;

///////////////////////////////////////////////////
fs.readdir('./events', (_err, files) => {
	files.forEach((file) => {
		if (!file.endsWith('.js')) return;
		const event = require(`./events/${file}`);
		const eventName = file.split('.')[0];
		console.log(`クライアントイベントの読み込みが完了: ${eventName}`);
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});

client.commands = [];
fs.readdir('./commands', (err, files) => {
	if (err) throw err;
	files.forEach((f) => {
		try {
			if (f.endsWith('.js')) {
				const props = require(`./commands/${f}`);
				const propsJson = props.data.toJSON();
				client.commands.push(propsJson);
				console.log(`コマンドの読み込みが完了: ${propsJson.name}`);
			}
		} catch (err) {
			console.log(err);
		}
	});
});

if (discord_token) {
	client.login(discord_token).catch((err) => {
		void err;
		console.log(
			'プロジェクトに入力したボットのトークンが間違っているか、ボットのINTENTSがオフになっています!',
		);
	});
} else {
	setTimeout(() => {
		console.log(
			'ボットのトークンをプロジェクト内の.envファイルに設定してください!',
		);
	}, 2000);
}

app.get('/', (request, response) => {
	response?.sendStatus(200);
});
app.listen(PORT, () => {
	console.log(`[NodeJS] Application Listening on Port ${PORT}`);
});
