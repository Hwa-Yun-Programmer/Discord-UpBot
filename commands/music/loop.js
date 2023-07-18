const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const handleError = require('../../handleError');
const client = require("../../index");

const createEmbed = (color, description) => {
    return new EmbedBuilder().setColor(color).setDescription(description);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("반복 재생 설정")
        .addStringOption(option =>
            option.setName("options")
                .setDescription("반복 설정: off, song, queue")
                .addChoices(
                    { name: "off", value: "off" },
                    { name: "song", value: "song" },
                    { name: "queue", value: "queue" },
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const { member, options, guild } = interaction;
        const option = options.getString("options");
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

            let mode = null;

            switch (option) {
                case "off":
                    mode = await queue.setRepeatMode(0);
                    break;
                case "song":
                    mode = await queue.setRepeatMode(1);
                    break;
                case "queue":
                    mode = await queue.setRepeatMode(2);
                    break;
            }

            mode = await queue.setRepeatMode(mode);

            mode = mode ? (mode === 2 ? "재생목록 반복" : "노래 반복") : "끄기";

            const embed = createEmbed("Orange", `🔁 반복재생 설정을 \`${mode}\`로 변경하였습니다.`);
            return interaction.reply({ embeds: [embed], ephemeral: true }).then(msg => {
                setTimeout(() => msg.delete(), 10000)
            });
        } catch (err) {
            handleError(err, interaction, createEmbed);
        }

    }
}