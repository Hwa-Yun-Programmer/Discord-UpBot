const {SlashCommandBuilder, InteractionResponse, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('크롬100')
        .addStringOption(
            option => option.setName('date').setDescription('The date for party')
        )
        .addStringOption(
            option => option.setName('time').setDescription('The time for party')
        )
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const date = interaction
            .options
            .getString('date') ?? '상호협의';
        const time = interaction
            .options
            .getString('time') ?? '상호협의';

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('**`[크롬바스 100 미션 파티원 구인]`**')
            .setDescription(`**일시 : ${date} ${time}**`)
            .addFields({
                name: '실린더 에르그 45 이상 / 주딜 맥 1350이상',
                value: '\u200B'
            }, {
                name: '**`상태 지원`**',
                value: '10레벨',
                inline: true
            }, {
                name: '**`프라가라흐`**',
                value: '10레벨',
                inline: true
            }, {
                name: '**`세인트 바드`**',
                value: '50레벨',
                inline: true
            })
            .setFooter({text: '참여는 아래 ❤를 눌러주세요[선착순 반영]\n(❌반응이 있을경우는 조건 제한 없음.)'});

        await interaction
            .reply({embeds: [exampleEmbed], fetchReply: true})
            .then((message) => {
                message.react('❤️').then(() => message.react('🛑'));
            })
            /*
        const filter = (reaction, user) => {
            return ['❤️', '🛑'].includes(reaction.emoji.name)
        };
        const collector = message.createReactionCollector(
            {filter, max: 6, dispose: true}
        );
        collector.on('collect', (reaction, user) => {
            if (user.tag !== '업타운#9665') {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                if (reaction.emoji.name === '❤️') {
                    players.push(user.id);
                } else if (reaction.emoji.name === '🛑' && user.tag == interaction.user.tag) {
                    var msg = '';
                    players.forEach((item) => {
                        msg += `<@${item}>`
                    });
                    interaction.followUp('모집완료' + msg);
                    collector.stop();
                }
            }
        });

        collector.on('remove', (reaction, user) => {
            if (reaction.emoji.name === '❤️') {
                players.forEach((item, index) => {
                    if (user.id == item) {
                        players.splice(index, 1);
                    }
                });
            }
            console.log(players)
        });
        */
    }
};