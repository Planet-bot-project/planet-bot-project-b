const {
	Client,
	GatewayIntentBits,
	ActivityType,
	REST,
	Routes,
	SlashCommandBuilder,
	InteractionType,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageFlags,
} = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
	],
});
require('dotenv').config({ quiet: true });

//機密情報取得
const discord_token = process.env.token;

///////////////////////////////////////////////////
// コマンド定義
client.commands = [];
const ping = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('this is ping command.');
const ephemeral = new SlashCommandBuilder()
	.setName('ephemeral')
	.setDescription('ephemeral test');
client.commands.push(ping);
client.commands.push(ephemeral);

///////////////////////////////////////////////////
client.on('clientReady', () => {
	const rest = new REST({ version: '10' }).setToken(process.env.token);
	(async () => {
		try {
			await rest.put(Routes.applicationCommands(client.user.id), {
				body: await client.commands,
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
			name: `所属サーバー数は${
				client.guilds.cache.size
			}｜このサーバーが利用しているシャードは${
				Number(client?.shard?.ids) + 1 ? Number(client?.shard?.ids) + 1 : '1'
			}`,
			type: ActivityType.Listening,
		});
	}, 10000);
});

client.on('interactionCreate', async (interaction) => {
	try {
		if (!interaction?.guild) {
			return interaction?.reply({
				content:
					'❌ このBOTはサーバー内でのみ動作します。\nお手数をおかけしますが、サーバー内でご利用ください。',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			if (interaction?.type === InteractionType.ApplicationCommand) {
				switch (interaction.commandName) {
					case 'ping': {
						await interaction.reply(`this is ${interaction.commandName}`);
						break;
					}
					case 'ephemeral': {
						const row = new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setCustomId('delete_ephemeral')
								.setLabel('削除')
								.setStyle(ButtonStyle.Danger),
						);

						await interaction.reply({
							content:
								'このメッセージはエフェメラルです。ボタンを押すと削除されます。',
							components: [row],
							flags: MessageFlags.Ephemeral,
						});
						break;
					}
				}
			}

			if (interaction?.type === InteractionType.MessageComponent) {
				if (interaction.customId === 'delete_ephemeral') {
					// ボタンを押した後のグルグル表示をやめる
					await interaction.deferUpdate();
					// インタラクションの元のメッセージを削除する
					await interaction.deleteReply();

					await interaction.followUp({
						content: 'Ephemeralメッセージを削除しました。',
					});
				} else {
					await interaction.reply(`customID: ${interaction?.customId}`);
				}
			}
		}
	} catch (err) {
		console.log(err);
	}
});

client.login(discord_token);
