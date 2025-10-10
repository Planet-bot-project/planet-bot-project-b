const {
	SlashCommandBuilder,
	ModalBuilder,
	TextInputBuilder,
	LabelBuilder,
	TextInputStyle,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	TextDisplayBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('new_modal')
		.setDescription('新しいモーダルを試しましょう！'),

	run: async (client, interaction) => {
		try {
			let modal = new ModalBuilder()
				.setCustomId('newModal')
				.setTitle('新しいモーダル');

			let shortTextInput = new LabelBuilder()
				.setLabel('短いテキスト入力')
				.setDescription('ここに短いテキストを入力してください')
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId('shortTextInput')
						.setStyle(TextInputStyle.Short)
						.setPlaceholder('短いテキストを入力...')
						.setMinLength(5)
						.setMaxLength(50)
						.setValue('初期値01')
						.setRequired(true),
				);

			let paragraphTextInput = new LabelBuilder()
				.setLabel('段落テキスト入力')
				.setDescription('ここに段落テキストを入力してください')
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId('paragraphTextInput')
						.setStyle(TextInputStyle.Paragraph)
						.setPlaceholder('段落テキストを入力...')
						.setMinLength(5)
						.setMaxLength(50)
						.setValue('初期値02')
						.setRequired(true),
				);

			let stringSelectMenu = new LabelBuilder()
				.setLabel('文字列セレクトメニュー')
				.setDescription('ここにセレクトメニューを追加してください')
				.setStringSelectMenuComponent(
					new StringSelectMenuBuilder()
						.setCustomId('stringSelectMenu')
						.setPlaceholder('オプションを選択...')
						.addOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel('オプション 1')
								.setValue('option1')
								.setDescription('これはオプション 1 です')
								.setEmoji('🔥')
								.setDefault(true),
							new StringSelectMenuOptionBuilder()
								.setLabel('オプション 2')
								.setValue('option2')
								.setDescription('これはオプション 2 です')
								.setEmoji('🌟'),
							new StringSelectMenuOptionBuilder()
								.setLabel('オプション 3')
								.setValue('option3')
								.setDescription('これはオプション 3 です')
								.setEmoji('🚀'),
						),
				);

			let textDisplay = new TextDisplayBuilder().setContent(
				'# ※これはテスト用モーダル表示コマンドであり、実行しても何も起こりません。',
			);

			modal
				.addLabelComponents(
					shortTextInput,
					paragraphTextInput,
					stringSelectMenu,
				)
				.addTextDisplayComponents(textDisplay);

			await interaction.showModal(modal);
		} catch (err) {
			console.log(err);
		}
	},
};
