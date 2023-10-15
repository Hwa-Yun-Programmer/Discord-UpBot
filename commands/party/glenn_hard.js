const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('글렌어렴')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .addStringOption(option => option.setName('메모').setDescription('코멘트'))
        .setDescription('글렌 베르나 어려움 파티원 구인'),

    async execute(interaction) {
        const date = interaction.options.getString('날짜') ?? '상호협의';
        const time = interaction.options.getString('시간') ?? '상호협의';
        const text = interaction.options.getString('메모') ?? '\u200B';
        const role = interaction.guild.roles.cache.find(role => role.name == "글렌어렴");

        let embed1 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({
                name: `${interaction.user.id}`
            })
            .setTitle('**`[글렌베르나 어려움 파티원 구인]`**')
            .setDescription(`**일시 : ${date} ${time}**`)
            .addFields(
                { name: `${text}`, value: `\u200B` },
                { name: ' **` 공통사항 `** ', value: '🔹 메인완료 / 특성만렙 / 학회졸업 등 기본 내실 완료.\n🔹 고래 3마리 ⬆️, 디링용 펫 2마리 ⬆️' },
                { name: '\u200B', value: '**` 상세 사항 `** - 하단의 아르카나 상새 맥 확인' },
                { name: '-**` 딜  러 `**', value: '\u200B', inline: false },
                { name: '**` 엘나 `**', value: '🔹 보호160 ⬆️ , 피4 1750 ⬆️ (스매세공 26 ⬆️, 레임에코), \n1800 ⬆️( 최공세공 + 스매에코) + 너클/랜스 1500 ⬆️', inline: false },
                { name: '**` 닼메 `**', value: '🔹 스태프( 마공1550 ⬆️ ) or 원드( 마공1450 ⬆️ )', inline: true },
                { name: '**` 알스 `**', value: '🔹 피5 1650 ⬆️ \n \u200B\n', inline: true },
                { name: '\n -**` 서포터 `**', value: '\u200B', inline: false },
                { name: '**` 바드 `**', value: '🔹 캐속힐링원드 + 보호140⬆️, 전장세팅 + 너클 / 랜스 1500⬆️ or 활 피5 1550⬆️', inline: false },
                { name: '\u200B', value: '🔹 **`1순위`** - 신연 세팅 (신연비 10 - 60%, 신연비 6 - 63% )', inline: false },
                { name: '\u200B', value: '🔹 **`2순위`** - 보연 훌연세팅  (보연:50%, 훌연 : 55% )', inline: false },
                { name: '\u200B', value: 'ㄴ 훌연 / 신들 연주 비율 6미만은 채용을 하지않습니다.', inline: false },
                { name: `\u200B`, value: `\u200B` },
            ).setFooter({ text: '⁂ 위의 스펙은 공팟 기준 권장스펙입니다. 미달되는 부분이 있을 경우에는 파티장에게 문의 후에 신청 부탁드립니다.' });

        let embed2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('**`[엘나 현재 목록 인원]`** 0 명');
        let embed3 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('**`[바드 현재 목록 인원]`** 0 명');
        let embed4 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('**`[닼메 현재 목록 인원]`** 0 명');
        let embed5 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('**`[알스 현재 목록 인원]`** 0 명');

        let button1 = new ButtonBuilder()
            .setCustomId('knight')
            .setLabel('엘나')
            .setEmoji('<:Elemental_knight:1120378775692115968>')
            .setStyle(ButtonStyle.Secondary);

        let button2 = new ButtonBuilder()
            .setCustomId('bard')
            .setLabel('바드')
            .setEmoji('<:Saint_bard:1120378783317368932>')
            .setStyle(ButtonStyle.Secondary);

        let button3 = new ButtonBuilder()
            .setCustomId('mage')
            .setLabel('닼메')
            .setEmoji('<:Dark_mage:1120378783317368932>')
            .setStyle(ButtonStyle.Secondary);

        let button4 = new ButtonBuilder()
            .setCustomId('stinger')
            .setLabel('알스')
            .setEmoji('<:Alchemic_stinger:1140448034271019088>')
            .setStyle(ButtonStyle.Secondary);

        let button5 = new ButtonBuilder()
            .setCustomId('confirm_glenn')
            .setLabel('모집완료')
            .setEmoji('<:Calvin_yes:1120378770457628823>')
            .setStyle(ButtonStyle.Danger);

        let row = new ActionRowBuilder().addComponents(button1, button2, button3, button4, button5)

        await interaction.reply({ embeds: [embed1, embed2, embed3, embed4, embed5], components: [row], fetchReply: true });
    }
};
