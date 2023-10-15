const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('크롬100')
		.addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
		.addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
		.addStringOption(option => option.setName('메모').setDescription('코멘트'))
		.setDescription('크롬바스 100 파티원 구인'),
        
    async execute(interaction) {
        const date = interaction.options.getString('날짜') ?? '상호협의';
        const time = interaction.options.getString('시간') ?? '상호협의';
        const text = interaction.options.getString('메모') ?? '\u200B';
        const role = interaction.guild.roles.cache.find(role => role.name == "크롬100");

        let embed1 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[크롬바스 100 파티원 구인]`**')
        .setAuthor({
            name: `${interaction.user.id}`
        })
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
            { name: '**`공통 사항`**', value: `\u200B` },
            { name: '**`실린더`**', value: 'S에르그 50', inline: true },
            { name: '**`아르카나`**', value: '10개방', inline: true },
            { name: '**`특성`**', value: '프라가라흐 10레벨', inline: true },
            { name: `${text}`, value: `\u200B` }, 
            { name: '**`상세사항`** - 하단의 아르카나 상세 맥 확인', value: `\u200B` }, 
            { name: '**`딜  러`**', value: '주딜[너클/랜스 1400 ⬆️ (권장1450 ⬆️) or 활 피5 1550 ⬆️ \n\n ', inline: false }, 
            { name: '**`서포터`**', value: '전장 47퍼 ⬆️ / 인형 S50 / 바드 10개방 ', inline: false }, 
            { name: `\u200B`, value: `\u200B` }, 
            { name: '**`엘레멘탈 나이트`**', value: '피어싱4 / 맥 1700 ⬆️', inline: true }, 
			{ name: '**`알케믹 스팅어`**', value: '피어싱5 / 맥 1650 ⬆️', inline: true },
			{ name: '**`다크 메이지 (풀도핑)`**', value: '원드 1450 / 스태프 1500 ⬆️', inline: true},
        ).setFooter({text: '⁂ 엘나/알스/닼메 등 아르카나 개방 레벨이 10 미만일 경우에는 바드로 와주시기 바랍니다. 위의 기준은 모집하는 파티장에 따라 달라질 수 있습니다.'});

        let embed2 = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('**`[파티원 현재 목록 인원]`**');

        let button1 = new ButtonBuilder()
            .setCustomId('join')
            .setLabel('참가 / 탈퇴')
            .setEmoji('<:Meoljin_gaechu:1120622311628881931>')
            .setStyle(ButtonStyle.Secondary);
            
        let button2 = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('모집완료')
            .setEmoji('<:Calvin_yes:1120378770457628823>')
            .setStyle(ButtonStyle.Danger);

        let row = new ActionRowBuilder().addComponents(button1, button2)

        await interaction.reply({embeds : [embed1, embed2], components: [row],  fetchReply: true});
    }
};

