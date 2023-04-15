const { SlashCommandBuilder, InteractionResponse, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('항교')
		.addStringOption(option =>
			option
				.setName('날짜')
				.setDescription('파티 출발 일자'))
		.addStringOption(option =>
			option
				.setName('시간')
				.setDescription('파티 출발 시간'))
				
		.setDescription('항공 교역 선원 구인'),
	async execute(interaction) {
		const date = interaction.options.getString('날짜') ?? '상호협의';
		const time = interaction.options.getString('시간') ?? '상호협의';

		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('**`[항공 교역 상단원 모집]`**')
			.setDescription(`**일시 : ${date} ${time}**`)
			.addFields(
				{ name: '장소 : 켈라 베이스 캠프 교역소', value: '\u200B' },
                { name: '**`켈라 ▶️  코르 ▶️  발레스 ▶️  필리아 ▶️  켈라`**', value: '위 순서대로 한바퀴이며 중도 하차 가능합니다.' },
                { name: '**`준비물`** :', value: '듀얼건 or 발리스타용 볼트' }
			)
			.setFooter({ text: '🔹선착순 8명(선장 포함)으로 운영할 예정이면, 2인 이상이면 출발합니다. \n🔹시세에 따라 순서가 변동될 수 있습니다.'});
            
			
		await interaction.reply({embeds: [exampleEmbed], fetchReply: true,}).then((message) => {
			message.react('⭕');
		})
	},
};