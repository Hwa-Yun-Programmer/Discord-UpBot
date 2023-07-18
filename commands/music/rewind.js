const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const handleError = require('../../handleError');
const client = require("../../index");

const createEmbed = (color, description) => {
    return new EmbedBuilder().setColor(color).setDescription(description);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rewind")
        .setDescription("되돌리기")
        .addIntegerOption(option =>
            option.setName("seconds")
                .setDescription("되돌릴 시간을 입력해주세요 (10 = 10s)")
                .setMinValue(0)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const seconds = options.getInteger("seconds");
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

            if (!queue) {
                const embed = createEmbed("Red", "대기중인 재생목록이 없습니다.");
                return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                });
            }

            await queue.seek(queue.currentTime - seconds);
            const embed = createEmbed("Blue", `⏪ 노래를 \`${seconds}s\`초 많큼 되돌렸습니다.`);
            return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                setTimeout(() => msg.delete(), 10000)
            });

        } catch (err) {
            handleError(err, interaction, createEmbed);
        }
    }
}