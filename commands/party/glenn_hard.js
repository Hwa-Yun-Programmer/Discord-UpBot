const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

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
        .setTitle('**`[글렌베르나 어려움 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
			{ name: '🔹 부족한 인원은 따로 모집할 예정입니다.\n🔹 길드원들은 키 있는 인원들끼리 억분, 지인/공팟은 3억 이상 분배\n🔹 8억 이상 먹을 시, 키 없는 인원들 2천숲씩 뽀찌지급\n🔹 엘나, 바드 인원 비율 상관없이 신청부탁드립니다.', value: '\n' },
			{ name: `${text}`, value: `${role}` },
			{ name: '\u200B', value: '**` 🧡 바드 스펙 조건`**' },
			{ name: '`보호`', value: '130 ⬆️ ', inline: true },
			{ name: '`전장`', value: '보연 47% ⬆️ / 신들 58% ⬆️', inline: true },
			{ name: '`주딜 (너클 / 활)`', value: '맥 1400 ⬆️ ', inline: true },
			{ name: '`힐링원드`', value: '캐속 17레벨 ⬆️ ', inline: true },
			{ name: '\u200B', value: '**` ❤️ 엘나 스펙 조건`**' },
			{ name: '`보호`', value: '150 ⬆️ ', inline: true },
			{ name: '`양손검`', value: '피어싱4 ⬆️ / 맥 1700 ⬆️ ', inline: true },
			{ name: '`주딜`', value: '1400 ⬆️ ', inline: true }
		).setFooter({text: '참여는 아래 버튼을 눌러주세요 [선착순 반영]'});

        let embed2 = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('**`[엘나 현재 목록 인원]`** 0 명');
		
        let embed3 = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('**`[바드 현재 목록 인원]`** 0 명');

        let button1 = new ButtonBuilder()
            .setCustomId('knight')
            .setLabel('엘나 참가 / 탈퇴')
            .setEmoji('<:Elemental_knight:1120378775692115968>')
            .setStyle(ButtonStyle.Secondary);
            
        let button2 = new ButtonBuilder()
            .setCustomId('bard')
            .setLabel('바드 참가 / 탈퇴')
            .setEmoji('<:Saint_bard:1120378783317368932>')
            .setStyle(ButtonStyle.Secondary);

        let button3 = new ButtonBuilder()
            .setCustomId('confirm_glenn')
            .setLabel('모집완료')
            .setEmoji('<:Calvin_yes:1120378770457628823>')
            .setStyle(ButtonStyle.Danger);
            
        let row = new ActionRowBuilder().addComponents(button1, button2, button3)

        await interaction.reply({embeds : [embed1, embed2, embed3], components: [row],  fetchReply: true});
	}
};
