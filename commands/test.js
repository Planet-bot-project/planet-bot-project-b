const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("埋め込みの編集"),
  run: async (client, interaction) => {
    const embed = new EmbedBuilder().setTitle("タイトル");

    //const editing = new EmbedBuilder().setTitle("編集した！");

    const timeout = new EmbedBuilder().setTitle(
      "1分たったのでボタンを削除しました"
    );

    const button = new ButtonBuilder()
      .setCustomId("button")
      .setLabel("編集")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    const response = await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      /*
        const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });
      */
      const confirmation = response.createMessageComponentCollector({
        collectorFilter,
        time: 60000,
      });

      /*
      if (confirmation.customId === "button") {
        await confirmation.edit({ embed: [editing], components: [row] });
      }
      */
      confirmation.on("collect", async (i) => {
        if (i.customId == "button") {
          embed.setTitle("編集した！");

          await i.update({ embeds: [embed], components: [row] });
        }
      });
    } catch (e) {
      console.log(`get an error ${e}`);
    }
  },
};
