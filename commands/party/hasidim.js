const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('하시딤')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .addStringOption(option => option.setName('메모').setDescription('코멘트'))
        .setDescription('하시딤 결사대원 구인'),
        
    async execute(interaction) {
        const date = interaction.options.getString('날짜') ?? '상호협의';
        const time = interaction.options.getString('시간') ?? '상호협의';
        const text = interaction.options.getString('메모') ?? '\u200B';
        const role = interaction.guild.roles.cache.find(role => role.name == "하시딤");

        const embed1 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[하시딤 결사대원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
            {name : ' 🔹 7채널에서 진행하며 부사가, 사도의 정수 등 독식입니다. \n\n🔹 하시딤을 어떻게 진행하는지 가이드가 필요하신 분들은 단장[존칼빈] 혹은 부단장[최강심안]에게 요청해주시기 바랍니다. ', value : '\u200B'}, 
            {name : '🔹 레이드 파티 시작 20분 전에 조표가 나올 예정이며, 조표가 나온 이후에는 취소/수정이 불가합니다. \n\n🔹 인원 수 초과시에는 신청 순으로 마감하며, 참여 인원 12명 미달시에는 그 날 파티는 열지 않습니다. \n\n🔹 원하는 보직이 있으신 분들은 단장[존칼빈] 혹은 부단장[최강심안]에게 요청해주시기 바랍니다.', value : '\u200B'}, 
            {name : `${text}`, value : `${role}`}
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