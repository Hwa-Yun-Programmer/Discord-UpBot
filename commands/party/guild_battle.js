const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('길드전')
		.addStringOption(option => option.setName('모집기간').setDescription('파티 모집 기간 ( 시간 / 일시 )'))
		.addStringOption(option => option.setName('출발시간').setDescription('파티 출발 시간 ( 시간 / 일시 )'))
		.addStringOption(option => option.setName('메모').setDescription('코멘트'))
		.setDescription('길드전 파티원 구인'),

	async execute(interaction) {
		const date1 = interaction.options.getString('모집기간') ?? '상호협의';
		const date2 = interaction.options.getString('출발시간') ?? '상호협의';
		const text = interaction.options.getString('메모') ?? '\u200B';
		const role = interaction.guild.roles.cache.find(role => role.name == "길드전 멤버");

		const embed1 = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`**\`[${date1} 던바튼 길드원 모집 ]\`**`)
			.setDescription(`**모집 기간 : ${date2} 까지 모집**`)
			.addFields(
				{name: `**참여 시간 : ${date2} 부터 진행**`, value: `\u200B`},
                {name: '**`특이사항`**', value: `**신청인원 15명 미만시 길드전 진행되지 않습니다.**`},
                {name: '\u200B', value: `\u200B`},
                {name: '**`우승 시 혜택`**', value: '** 🔹 던바튼 수호자(최댐 30)\n 🔹 매일 생기는 무그통 무던통\n 🔹 페푸용 챔피언 음식(올스텟 30)**', inline: true},
                {name: '**`추가 참고 사항`**', value : `${text}`},
                {name: `\u200B`, value : `${role}\n**길드전 관련 문의는 <@391502776351588352>로 부탁드립니다**`}
			)

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