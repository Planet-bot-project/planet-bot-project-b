const {
	Client,
	GatewayIntentBits,
	SlashCommandBuilder,
	REST,
	Routes,
	ActivityType,
} = require('discord.js');
require('dotenv').config({ quiet: true });

const TOKEN = process.env.token;

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

// スラッシュコマンドの登録
const custom = new SlashCommandBuilder()
	.setName('custom_choice')
	.setDescription('ユーザーによって選択肢が変わる')
	.addStringOption(
		(option) =>
			option
				.setName('option')
				.setDescription('選択してください')
				.setAutocomplete(true), // オートコンプリートを有効化
	);
const ping = new SlashCommandBuilder().setName('ping').setDescription('pong!!');
const commands = [custom, ping];

client.on('clientReady', () => {
	//discord botへのコマンドの設定
	const rest = new REST({ version: '10' }).setToken(TOKEN);
	(async () => {
		try {
			await rest.put(Routes.applicationCommands(client.user.id), {
				body: await commands,
			});
			console.log('スラッシュコマンドの再読み込みに成功しました。');
		} catch (err) {
			console.log(
				`❌ スラッシュコマンドの再読み込み時にエラーが発生しました。：\n${err}`,
			);
		}
	})();

	console.log(`${client.user.username}への接続に成功しました。`);

	//カスタマイズアクティビティを設定
	setInterval(() => {
		client.user.setActivity({
			name: `v1`,
			type: ActivityType.Listening,
		});
	}, 10000);
});

// オートコンプリートイベントの処理
client.on('interactionCreate', async (interaction) => {
	if (interaction.isAutocomplete()) {
		if (interaction.commandName === 'custom_choice') {
			const userId = interaction.user.id;

			// ユーザーごとに異なる選択肢を設定
			let choices;
			if (userId === '728495196303523900') {
				choices = ['特別選択肢1', '特別選択肢2', '特別選択肢3'];
			} else {
				choices = ['通常選択肢A', '通常選択肢B', '通常選択肢C'];
			}

			// オートコンプリート用の候補を送信
			await interaction.respond(
				choices.map((choice) => ({ name: choice, value: choice })),
			);
		}
	}
});

// コマンド実行時の処理
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'custom_choice') {
		const choice = interaction.options.getString('option');
		await interaction.reply(`あなたが選んだのは: ${choice}`);
	} else {
		await interaction.reply('hi!');
	}
});

client.login(TOKEN);
