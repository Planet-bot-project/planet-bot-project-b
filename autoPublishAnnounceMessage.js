const http = require('http');
http
	.createServer((req, res) => {
		res.write('example.js is active.\nPlease check it.');
		res.end();
	})
	.listen(8080);

// Discord bot implements
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ quiet: true });
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});
const prefix = 'pj!';
const token = process.env.token;

// botが準備できれば発動され、 上から順に処理される。
client.on('clientReady', () => {
	// コンソールにReady!!と表示
	console.log('Ready!!');

	// ステータスを設定する
	setInterval(() => {
		client.user.setActivity({
			name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜ Ping値は、${client.ws.ping}msです`,
		});
	}, 10000);
	client.channels.cache.get('889486664760721418').send('起動しました！');

	// readyイベントここまで
});

// botがメッセージを受信すると発動され、 上から順に処理される。
client.on('messageCreate', (message) => {
	if (message.channel.type === ChannelType.GuildAnnouncement) {
		// メッセージを「公開」にする
		if (message.crosspostable) {
			message
				.crosspost()
				.then(() => {
					message.react('✅');

					setTimeout(async () => {
						const botReactions = message.reactions.cache.filter((reaction) =>
							reaction.users.cache.has(client.user.id),
						);

						try {
							for (const reaction of botReactions.values()) {
								await reaction.users.remove(client.user.id);
							}
						} catch (err) {
							console.log(err);
						}
					}, 5000);
				}) //メッセージを公開できたらリアクションをする
				.catch((err) => {
					console.log(err);
				});
		} else {
			message.react('❌'); //Botに権限がない場合

			setTimeout(async () => {
				const botReactions = message.reactions.cache.filter((reaction) =>
					reaction.users.cache.has(client.user.id),
				);

				try {
					for (const reaction of botReactions.values()) {
						await reaction.users.remove(client.user.id);
					}
				} catch (err) {
					console.log(err);
				}
			}, 5000);
		}
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === 'about') {
		message.channel.send({
			embeds: [
				{
					title: 'Planet bot β (JS)について',
					description: 'node.jsで作成された、BOT開発テスト用のbotです。',
					color: 3823616,
					timestamp: new Date(),
					thumbnail: {
						url: 'attachment://logo.png',
					},
					footer: {
						text: 'This bot is made by Hoshimikan6490',
						icon_url: 'attachment://me.png',
					},
				},
			],
			files: [
				{
					attachment: 'images/logo.png',
					name: 'logo.png',
				},
				{
					attachment: 'images/me.png',
					name: 'me.png',
				},
			],
		});
	}
});

client.on('interactionCreate', async (interaction) => {
	if (interaction.customId === 'support') {
		await interaction.reply('hi!!!');
	}
});

// botログイン
client.login(token);
