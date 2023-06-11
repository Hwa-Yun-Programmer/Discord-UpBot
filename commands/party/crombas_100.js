const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const filter = (reaction) => {
	return ['❤️', '🧡', '🛑'].includes(reaction.emoji.name);
};

function createRecruitParty(date, time, text) {
    let embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[크롬바스 100 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
            { name: '실린더 에르그 45 이상 / 주딜 맥 1350이상', value: `\n` }, 
            { name: `${text}`, value: `\u200B` }, 
            { name: '**`세인트 바드`**', value: '50레벨 ⬆️', inline: true }, 
            { name: '**`특성`**', value: '프라 10렙', inline: true }, 
            { name: '**`특성`**', value: '상지 10렙', inline: true }, 
            { name: '**`주딜 조건`**', value: '맥 1350 ⬆️', inline: true }, 
            { name: '**`홀샷 별도 모집`**', value: '🧡 눌러주세요', inline: true }, 
            { name: '\u200B', value: '\u200B', inline: true}
        ).setFooter({text: '참여는 아래 ❤를 눌러주세요 [선착순 반영]'});

    return embed;
}

function createFinishParty(content) {
	let embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[크롬바스 100 파티원 구인]`**')
        .addFields({
            name: '**모집 완료**',
            value: content
        });
    return embed;
};

function createCollector(message, interaction) {
	const collector = message.createReactionCollector({ filter, max: 99, dispose: true });
	const attack = new Set();
	const support = new Set();

	collector.on('collect', (reaction, user) => {
		if (user.tag === '업타운#9665') return;

		if (reaction.emoji.name === '❤️') {
			attack.add(user.id);
		} else if (reaction.emoji.name === '🧡') {
			support.add(user.id);
		} else if (reaction.emoji.name === '🛑' && user.tag === interaction.user.tag) {
			const attackers = Array.from(attack).map(item => `<@${item}>`).join(' ');
            const supporters = Array.from(support).map(item => `<@${item}>`).join(' ');

			interaction.channel.send({
				embeds: [createFinishParty(`딜러 : ${attackers} \n홀샷 : ${supporters}`)]
			});

			collector.stop();
		}
	});

	collector.on('remove', (reaction, user) => {
		if (reaction.emoji.name === '❤️') {
			attack.delete(user.id);
		} else if (reaction.emoji.name === '🧡') {
			support.delete(user.id);
		}
	});

	return collector;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('크롬100')
		.addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
		.addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
		.addStringOption(option => option.setName('메모').setDescription('코멘트'))
		.setDescription('크롬바스 100 파티원 구인'),

	async execute(interaction) {
		const date = interaction.options.getString('날짜') ?? '상호협의';
		const time = interaction.options.getString('시간') ?? '상호협의';
		const comment = interaction.options.getString('메모') ?? '\u200B';

		const message = await interaction.reply({
			embeds: [createRecruitParty(date, time, comment)],
			fetchReply: true
		});
		await message.react('❤️');
		await message.react('🧡');
		await message.react('🛑');

		createCollector(message, interaction);
	}
};
