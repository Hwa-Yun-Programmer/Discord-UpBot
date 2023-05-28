const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("노래 제목 또는 주소를 입력해주세요")
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const { options, member, guild, channel } = interaction;

            const query = options.getString("query");
            const voiceChannel = member.voice.channel;

            const embed = new EmbedBuilder();

            if (!voiceChannel) {
                embed.setColor("Red").setDescription("이 명령어를 사용할려면 음성채널에 먼저 들어와야합니다.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Red").setDescription(`다른 채널에서 이미 사용중입니다. <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            try {

                client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
                return interaction.reply({ content: "🎶 재생목록에 추가되었습니다." });

            } catch (err) {
                console.log(err);
                embed.setColor("Red").setDescription("⛔ | 먼가.. 잘못됬는데..?");

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.log(err);
            embed.setColor("Red").setDescription("⛔ | 먼가.. 잘못됬는데..?");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
    }
}