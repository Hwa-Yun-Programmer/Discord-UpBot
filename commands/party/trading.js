const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('항교')
		.addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
		.addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
		.addStringOption(option => option.setName('메모').setDescription('코멘트'))
		.setDescription('항공 교역 상단원 모집'),

	async execute(interaction) {
		const date = interaction.options.getString('날짜') ?? '상호협의';
		const time = interaction.options.getString('시간') ?? '상호협의';
		const text = interaction.options.getString('메모') ?? '\u200B';
		const role = interaction.guild.roles.cache.find(role => role.name == "교역");

		console.log(interaction.user)

		const embed1 = new EmbedBuilder()
			.setColor(0x0099FF)
			.setAuthor({
				name: `${interaction.user.username}`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTitle('**`[항공 교역 상단원 모집]`**')
			.setDescription(`**일시 : ${date} ${time}**`)
			.addFields(
				{name: '장소 : 켈라 베이스 캠프 교역소', value: `${role}`},
                {name: '**`켈라 ▶️  코르 ▶️  발레스 ▶️  필리아 ▶️  켈라`**', value: '위 순서대로 한바퀴이며 중도 하차 가능합니다.'},
                {name: '**`준비물`** :', value: '듀얼건 or 발리스타용 볼트'}
			).setFooter({ text: '🔹선착순 8명(선장 포함)으로 운영할 예정이면, 2인 이상이면 출발합니다. \n🔹시세에 따라 순서가 변동될 수 있습니다.'});

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
