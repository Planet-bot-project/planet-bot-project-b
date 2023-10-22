const http = require('http');
http.createServer(function(req, res) {
  res.write('save.js is active.\nPleace check it.');
  res.end();
}).listen(8080);

const { Client, GatewayIntentBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

//起動確認
client.on("ready", () => {
  // コンソールにReady!!と表示
  console.log("Ready!!");

  // ステータスを設定する
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜　Ping値は、${client.ws.ping}msです`
    })
  }, 10000)
  client.channels.cache.get("889486664760721418").send("起動しました！");

  // readyイベントここまで
});

//返答
client.on('messageCreate',async message => {
    if (message.author.bot) {
        return;
    }

    if (message.content == 'hi') {
        message.channel.send('hi!');
    }

    if (message.content == 'pj!save') {
      const options = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('transcript')
          .setLabel('保存する')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("📥"),
        );
　　    await message.channel.send({
        embeds: [{
          title: 'save',
          color: 0x808080
        }],
        components: [options]
      })
    }
});

client.on('interactionCreate',async interaction => {
    const channel = interaction.channel; // or however you get your TextChannel
    const channel_topic = channel.topic
    const customer_user_id = channel_topic.substr( 6 )
      
    // Must be awaited
    const attachment = await discordTranscripts.createTranscript(channel, {
      limit: -1,
      filename: `support_transcript_with_${customer_user_id}.html`
    });
    await interaction.channel.send({
      embeds: [
        {
          title: "save",
          color: 0x20FF20
        }
      ],
      files: [attachment]
    })
})

//Discordへの接続
const token = process.env['TOKEN']
client.login(token);