const { SlashCommandBuilder, InteractionResponse, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('크롬30')
		.addStringOption(option =>
			option
				.setName('날짜')
				.setDescription('파티 출발 일자'))
		.addStringOption(option =>
			option
				.setName('시간')
				.setDescription('파티 출발 시간'))
				
		.setDescription('크롬바스 30 파티원 구인'),
	async execute(interaction) {
		const date = interaction.options.getString('날짜') ?? '상호협의';
		const time = interaction.options.getString('시간') ?? '상호협의';

		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('**`[크롬바스 30 미션 파티원 구인]`**')
			.setDescription(`**일시 : ${date} ${time}**`)
			.addFields(
				{ name : '크롬바스 선행퀘 완료 ( 종합 전투레벨 1500 ⬆️ ) ', value : '\u200B' },
				{ name : '2인 이상 모일 시 출발합니다.', value : '\u200B'}
			)
			.setFooter({ text: '참여는 아래 ❤를 눌러주세요 [선착순 반영] \n(❌반응이 있을경우는 조건 제한 없음.)'});
			
		await interaction.reply({embeds: [exampleEmbed], fetchReply: true,}).then((message) => {
			message.react('❤️');
		})
		
	},
};