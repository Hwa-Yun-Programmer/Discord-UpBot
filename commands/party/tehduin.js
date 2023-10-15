const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('테흐')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .addStringOption((option) => option.setName('보스').setDescription('테흐두인 미션 종류')
		.addChoices(
			{ name: '허상', value: '허상' },
			{ name: '악몽', value: '악몽' },
			{ name: '페피', value: '페피' },
            { name: '문어', value: '문어' },
		))
        .addStringOption(option => option.setName('메모').setDescription('코멘트'))
        .setDescription('테흐두인 미션 파티원 구인'),
        
    async execute(interaction) {
        const date = interaction.options.getString('날짜') ?? '상호협의';
        const time = interaction.options.getString('시간') ?? '상호협의';
        const boss = interaction.options.getString('보스') ?? '상호협의';
        const text = interaction.options.getString('메모') ?? '\u200B';
        const role = interaction.guild.roles.cache.find(role => role.name == "테흐");

        let embed1 = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('**`[테흐두인 파티원 구인]`**')
		.setDescription(`**일시 : ${date} ${time}**`)
        .setAuthor({
            name: `${interaction.user.id}`
        })
		.addFields(
            { name: '**`던전 종류`**', value: boss, inline: true }, 
            { name: '**` 모집 조건`**', value: '맥 1250 ⬆️ / 마공 1250 ⬆️', inline: true }, 
            { name: '**`서포터 모집 조건`**', value: '서포트샷 세트 보유', inline: true }, 
            { name: `${text}`, value: `${role}` }, 
        ).setFooter({text : '참여는 아래 버튼을 눌러주세요 [선착순 반영]'});

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

        await interaction.reply({contents: 'dd', embeds : [embed1, embed2], components: [row],  fetchReply: true});
    }
};

