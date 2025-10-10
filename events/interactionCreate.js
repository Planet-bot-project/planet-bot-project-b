const {
	InteractionType,
	ApplicationCommandType,
	MessageFlags,
} = require('discord.js');
const fs = require('fs');

module.exports = async (client, interaction) => {
	try {
		if (!interaction?.guild) {
			return interaction?.reply({
				content:
					'❌ このBOTはサーバー内でのみ動作します。\nお手数をおかけしますが、サーバー内でご利用ください。',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			if (interaction?.type === InteractionType.ApplicationCommand) {
				fs.readdir('./commands', (err, files) => {
					if (err) throw err;
					files.forEach(async (f) => {
						const props = require(`../commands/${f}`);
						const propsJson = props.data.toJSON();

						//propsJsonがundefinedだった場合は、スラッシュコマンドとして、タイプを1にする
						if (propsJson.type === undefined) {
							propsJson.type = ApplicationCommandType.ChatInput;
						}

						if (
							interaction.commandName === propsJson.name &&
							interaction.commandType === propsJson.type
						) {
							try {
								await props.run(client, interaction);
								return;
							} catch (err) {
								console.log(err);
								return interaction?.reply({
									content: `❌ 何らかのエラーが発生しました。`,
									flags: MessageFlags.Ephemeral,
								});
							}
						}
					});
				});
			}

			if (interaction?.type === InteractionType.MessageComponent) {
				await interaction.reply(`customID: ${interaction?.customId}`);
			}
		}
	} catch (err) {
		console.log(err);
	}
};
