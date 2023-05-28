const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("forward")
        .setDescription("건너뛰기")
        .addIntegerOption(option =>
            option.setName("seconds")
                .setDescription("건너뛸 시간을 입력해주세요. (10 = 10s)")
                .setMinValue(0)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const seconds = options.getInteger("seconds");
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

            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed.setColor("Red").setDescription("대기중인 재생목록이 없습니다.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await queue.seek(queue.currentTime + seconds);
            embed.setColor("Blue").setDescription(`⏩ 노래를 \`${seconds}s\`.초 만큼 건너뛰었습니다.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | 먼가.. 잘못됬는데..?");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}