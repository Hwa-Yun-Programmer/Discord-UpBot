const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const filter = (reaction) => {
	return ['❤️', '🧡', '🛑'].includes(reaction.emoji.name);
};

function createRecruitParty(date, time, text) {
    let embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[글렌 쉬움 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
            { name: '글렌 베르나 선행퀘스트 완료 ( 종합 전투레벨 1500 ⬆️ ) ', value: '\n' }, 
            { name: `${text}`, value: `\u200B` }, 
            { name: '**`아르카나 레벨 `**', value: '50레벨', inline: true }, 
            { name: '**`에르그 레벨`**', value: '50레벨 ⬆️', inline: true }
		).setFooter({text: '참여는 아래 ❤를 눌러주세요 [선착순 반영]'});

    return embed;
}

function createFinishParty(content) {
	let embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[글렌 쉬움 파티원 구인]`**')
        .addFields({
            name: '**모집 완료**',
            value: content
        });
    return embed;
};

function createCollector(message, interaction) {
	const collector = message.createReactionCollector({ filter, max: 99, dispose: true });
	const attack = new Set();

	collector.on('collect', (reaction, user) => {
		if (user.tag === '업타운#9665') return;

		if (reaction.emoji.name === '❤️') {
			attack.add(user.id);
		}  else if (reaction.emoji.name === '🛑' && user.tag === interaction.user.tag) {
			const attackers = Array.from(attack).map(item => `<@${item}>`).join(' ');

			interaction.channel.send({
				embeds: [createFinishParty(`파티원 : ${attackers}`)]
			});

			collector.stop();
		}
	});

	collector.on('remove', (reaction, user) => {
		if (reaction.emoji.name === '❤️') {
			attack.delete(user.id);
		}
	});

	return collector;
}

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
		const comment = interaction.options.getString('메모') ?? '\u200B';

		const message = await interaction.reply({
			embeds: [createRecruitParty(date, time, comment)],
			fetchReply: true
		});
		await message.react('❤️');
		await message.react('🛑');

		createCollector(message, interaction);
	}
};
