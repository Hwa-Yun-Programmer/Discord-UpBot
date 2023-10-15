const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('글렌쉬움')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .addStringOption(option => option.setName('메모').setDescription('코멘트'))
        .setDescription('글렌 베르나 쉬움 파티원 구인'),

	async execute(interaction) {
		const date = interaction.options.getString('날짜') ?? '상호협의';
        const time = interaction.options.getString('시간') ?? '상호협의';
        const text = interaction.options.getString('메모') ?? '\u200B';
        const role = interaction.guild.roles.cache.find(role => role.name == "글렌쉬움");

        let embed1 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({
            name: `${interaction.user.id}`
        })
        .setTitle('**`[글렌 쉬움 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
            { name: '글렌 베르나 선행퀘스트 완료 ( 종합 전투레벨 1500 ⬆️ ) ', value: '\n' }, 
            { name: `${text}`, value: `${role}` }, 
            { name: '**`아르카나 레벨 `**', value: '50레벨', inline: true }, 
            { name: '**`에르그 레벨`**', value: '50레벨 ⬆️', inline: true }
		).setFooter({text: '참여는 아래 버튼을 눌러주세요 [선착순 반영]'});

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
