const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const handleError = require('../../handleError');
const client = require("../../index");

const createEmbed = (color, description) => {
    return new EmbedBuilder().setColor(color).setDescription(description);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("건너띄기"),
    async execute(interaction) {
        const { options, member, guild, channel } = interaction;
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

        try {
            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue.songs.length <= 1) return;

            if (!queue) {
                const embed = createEmbed("Red", "대기중인 재생목록이 없습니다.");
                return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                });
            }

            await queue.skip(voiceChannel);
            const embed = createEmbed("Blue", "⏩ 해당 노래를 건너뛰었습니다.");
            return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                setTimeout(() => msg.delete(), 10000)
            });

        } catch (err) {
            handleError(err, interaction, createEmbed);
        }
    }
}