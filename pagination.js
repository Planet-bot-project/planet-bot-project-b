const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	MessageFlags,
} = require('discord.js');

async function pagination(interaction, pages, time = 30 * 1000) {
	try {
		if (!interaction || !pages || !pages > 0)
			throw new Error('[PAGINATION] Invalid args');

		await interaction.deferReply();

		if (pages.length === 1) {
			return await interaction.editReply({
				embeds: pages,
				components: [],
				withResponse: true,
			});
		}

		let index = 0;

		const first = new ButtonBuilder()
			.setCustomId('pagefirst')
			.setEmoji('⏮️')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);
		const prev = new ButtonBuilder()
			.setCustomId('pageprev')
			.setEmoji('◀️')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);
		const pageCount = new ButtonBuilder()
			.setCustomId('pagecount')
			.setLabel(`${index + 1}/${pages.length}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(true);
		const next = new ButtonBuilder()
			.setCustomId('pagenext')
			.setEmoji('▶️')
			.setStyle(ButtonStyle.Primary);
		const last = new ButtonBuilder()
			.setCustomId('pagelast')
			.setEmoji('⏭️')
			.setStyle(ButtonStyle.Primary);

		const buttons = new ActionRowBuilder().addComponents([
			first,
			prev,
			pageCount,
			next,
			last,
		]);

		const msg = await interaction.editReply({
			embeds: [pages[index]],
			components: [buttons],
			withResponse: true,
		});

		const collector = await msg.createMessageComponentCollector({
			ComponentType: ComponentType.Button,
			time,
		});

		collector.on('collect', async (i) => {
			if (i.user.id !== interaction.user.id)
				return await i.reply({
					content: `Only **${interaction.user.name}** can use these buttons!`,
					flags: MessageFlags.Ephemeral,
				});

			await i.deferUpdate();

			if (i.customId === `pagefirst`) {
				index = 0;
				pageCount.setLabel(`${index + 1}/${pages.length}`);
			}

			if (i.customId === `pageprev`) {
				if (index > 0) index--;
				pageCount.setLabel(`${index + 1}/${pages.length}`);
			} else if (i.customId === `pagenext`) {
				if (index < pages.length - 1) {
					index++;
					pageCount.setLabel(`${index + 1}/${pages.length}`);
				}
			} else if (i.customId === `pagelast`) {
				index = pages.length - 1;
				pageCount.setLabel(`${index + 1}/${pages.length}`);
			}

			if (index === 0) {
				first.setDisabled(true);
				prev.setDisabled(true);
			} else {
				first.setDisabled(false);
				prev.setDisabled(false);
			}

			if (index === pages.length - 1) {
				next.setDisabled(true);
				last.setDisabled(true);
			} else {
				next.setDisabled(false);
				last.setDisabled(false);
			}

			await msg
				.edit({
					embeds: [pages[index]],
					components: [buttons],
				})
				.catch((err) => {
					void err;
				});

			collector.resetTimer();
		});

		collector.on('end', async () => {
			await msg
				.edit({
					embeds: [pages[index]],
					components: [],
				})
				.catch((err) => {
					void err;
				});
		});

		return msg;
	} catch (err) {
		console.log(`[ERROR] ${err}`);
	}
}

module.exports = pagination;

//このファイルをインポートするファイルでは、以下のようにすることで、ページを作れる
/*
const pagination = require("./pagination.js");

const embeds = [];
for (var i=0; i<4; i++) {
  embeds.push(new EmbedBuilder().setDescription(`page ${i + 1}`));
}

await pagination(interaction, embeds);
*/
