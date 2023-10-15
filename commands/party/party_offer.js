const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('파티구인')
        .setDescription('하시딤 결사대원 구인'),
        
    async execute(interaction) {
		const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[ 파티 구인 신청 ]`**')
        .setDescription('다운타운 길드 내의 원활한 파티구인을 위해 추가된 기능입니다.')
        .addFields(
            { name : '\u200B** 사용 방법 ** ', value : '\u200B'},
            { name : '\u200B🔹 아래 파티 모집 버튼을 눌러 원하시는 던전을 선택해주세요.', value : '**🔹 원하시는 던전이 선택 완료 후 모집 완료를 눌러 나오는 창에 추가 사항을 입력해주세요.**'}, 
            { name : '\u200B', value : '오류 발생시 <@359340249849004043> 으로 1:1 DM 부탁드립니다.'}
		);

		let button = new ButtonBuilder()
            .setCustomId('party_offer')
            .setLabel('파티 구인')
            .setEmoji('<:Calvin_yes:1120378770457628823>')
            .setStyle(ButtonStyle.Primary);

        let row = new ActionRowBuilder().addComponents(button)	

		await interaction.reply({embeds: [embed], components : [row]});
    }
};

//오류 발생시 <@359340249849004043> 으로 1:1 DM 부탁드립니다.