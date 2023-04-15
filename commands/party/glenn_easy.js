const { SlashCommandBuilder, InteractionResponse, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('글렌쉬움')
		.addStringOption(option =>
			option
				.setName('날짜')
				.setDescription('파티 출발 일자'))
		.addStringOption(option =>
			option
				.setName('시간')
				.setDescription('파티 출발 시간'))
				
		.setDescription('글렌 베르나 쉬움 파티원 구인'),
	async execute(interaction) {
		const date = interaction.options.getString('날짜') ?? '상호협의';
		const time = interaction.options.getString('시간') ?? '상호협의';

		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('**`[글렌 쉬움 미션 파티원 구인]`**')
			.setDescription(`**일시 : ${date} ${time}**`)
			.addFields(
				{ name : '글렌 베르나 선행퀘 완료 ( 종합 전투레벨 1500 ⬆️ ) ', value : '\u200B' },
				{ name: '**`아르카나 레벨`**', value: '50레벨', inline: true },
				{ name: '**`에르그 레벨`**', value: '50레벨 ⬆️', inline: true },
			)
			.setFooter({ text: '참여는 아래 ❤를 눌러주세요 [선착순 반영]'});
			
		await interaction.reply({embeds: [exampleEmbed], fetchReply: true,}).then((message) => {
			message.react('❤️');
		})
		
	},
};