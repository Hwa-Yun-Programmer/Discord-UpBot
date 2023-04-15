const {SlashCommandBuilder, InteractionResponse, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('정화')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .setDescription('정화 파티원 구인'),
    async execute(interaction) {
        const date = interaction
            .options
            .getString('날짜') ?? '상호협의';
        const time = interaction
            .options
            .getString('시간') ?? '상호협의';

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('**`[정화 10릴 파티원 모집]`**')
            .setDescription(`**일시 : ${date} ${time}**`)
            .addFields({
                name: '[ 딜러 : 엘나 : 1300, 활 : 1100, 랜스 : 1000, 너클 : 1000 ]',
                value: '\u200B'
            }, {
                name: '[ 서포터 : 폭풍같은 / 서포트샷 마스터 / 보헤미안 서포트샷 강화 ]',
                value: '\u200B'
            },)
            .setFooter({text: '참여는 아래 ❤를 눌러주세요[선착순 반영]\n(❌반응이 있을경우는 조건 제한 없음.)'});

        await interaction
            .reply({embeds: [exampleEmbed], fetchReply: true})
            .then((message) => {
                message.react('❤️');
            })

    }
};