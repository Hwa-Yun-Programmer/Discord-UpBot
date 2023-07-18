const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const handleError = require('../../handleError');
const client = require("../../index");

const createEmbed = (color, description) => {
    return new EmbedBuilder().setColor(color).setDescription(description);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("노래봇 볼륨 조절")
        .addIntegerOption(option =>
            option.setName("volume")
                .setDescription("10 = 10%")
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { member, guild, options } = interaction;
        const volume = options.getInteger("volume");
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
            client.distube.setVolume(voiceChannel, volume);
            return interaction.reply({ content: `🔉 볼륨을 ${volume}%로 설정했습니다.` });

        } catch (err) {
            handleError(err, interaction, createEmbed);
        }
    }
}