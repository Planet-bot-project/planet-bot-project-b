const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("test").setDescription("test"),

	run: async (client, interaction) => {
		try {
			await interaction.reply("this is test.");
		} catch (err) {
			console.log(err);
		}
	},
};
