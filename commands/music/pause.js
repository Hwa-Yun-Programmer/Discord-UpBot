const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const handleError = require('../../handleError');
const client = require("../../index");

const createEmbed = (color, description) => {
    return new EmbedBuilder().setColor(color).setDescription(description);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("노래 일시 정지"),
    async execute(interaction) {
        const { member, guild } = interaction;

        if (!member.voice.channel) {
            const embed = createEmbed("Red", "이 명령어를 사용하려면 음성 채널에 먼저 들어와야 합니다.");
            return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                setTimeout(() => msg.delete(), 10000)
            });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            const embed = createEmbed("Red", `다른 채널에서 이미 사용 중입니다. <#${guild.me.voice.channelId}>`);
            return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                setTimeout(() => msg.delete(), 10000)
            });
        }

        try {
            const queue = await client.distube.getQueue(guild.id);

            if (!queue) {
                const embed = createEmbed("Red", "대기 중인 재생 목록이 없습니다.");
                return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                });
            }

            await queue.pause();
            const embed = createEmbed("Orange", "⏸ 재생 중인 노래를 일시 정지했습니다.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            handleError(err, interaction, createEmbed);
        }
    }
};
