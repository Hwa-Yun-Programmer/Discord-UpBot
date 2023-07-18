const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const handleError = require('../../handleError');
const client = require("../../index");

const createEmbed = (color, description) => {
    return new EmbedBuilder().setColor(color).setDescription(description);
};

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

            if (!voiceChannel) {
                const embed = createEmbed("Red", "이 명령어를 사용할려면 음성채널에 먼저 들어와야합니다.");
                return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                const embed = createEmbed("Red", `다른 채널에서 이미 사용중입니다. <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                });
            }

           client.distube.play(voiceChannel, query, { textChannel: channel, member: member }).catch(err => handleError(err, interaction, createEmbed));
           return interaction.reply({ content: "🎶 재생목록에 추가되었습니다." });
          
        } catch (error) {
            handleError(err, interaction, createEmbed);
        }
    }
}
