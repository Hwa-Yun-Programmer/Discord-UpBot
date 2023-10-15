const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('역할')
		.setDescription('이모지를 클릭하여 역활 부여'),
	async execute(interaction) {

		const row = new ActionRowBuilder()
			.addComponents(new StringSelectMenuBuilder({
				custom_id: 'rules-select',
				placeholder: 'select an option',
				min_values: 0,
				max_values: 7,
				options: [
					{ label: '교역', value: '교역' },
					{ label: '정화', value: '정화' },
					{ label: '테흐', value: '테흐' },
					{ label: '하시딤', value: '하시딤' },
					{ label: '크롬30', value: '크롬30' },
					{ label: '크롬100', value: '크롬100' },
					{ label: '글렌쉬움', value: '글렌쉬움' },
					{ label: '글렌어렴', value: '글렌어렴' },
				],
			}));

		const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('**`[다운타운 파티구인 알림설정]`**')
		.setDescription('파티구인 게시판 이용시 원하는 파티구인이 생길경우 알림을 보내드립니다.')
		.addFields(
			{ name: '**`알림 설정 방법`**', value: '아래 선택매뉴에서 원하시는 알람을 선택해주세요.' },
			{ name: '**`알림 제거 방법`**', value: '불필요해진 알림은 한번 더 클릭하시면 제거됩니다.'},
			{ name: '**`채널 알림 설정 안내`**', value: '파티-구인 채널의 알림 설정을 아래와 같이 설정해주세요.'},
			{ name: '\u200B', value: '파티-구인 채널 우 클릭 -> 알림 설정 -> @mentions(맨션)' },
			{name : '\u200B', value : '오류 발생시 <@359340249849004043> 으로 1:1 DM 부탁드립니다.'}
		)
		//interaction.deferUpdate();
		const message = await interaction.channel.send({content: '\u200B', embeds : [embed], components: [row],});
		
	},
};

