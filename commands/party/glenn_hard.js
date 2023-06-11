const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const filter = (reaction) => {
	return ['❤️', '🧡', '🛑'].includes(reaction.emoji.name);
};

function createRecruitParty(date, time, text) {
    let embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[글렌베르나 어려움 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
			{ name: '🔹 부족한 인원은 따로 모집할 예정입니다.\n🔹 길드원들은 키 있는 인원들끼리 억분, 지인/공팟은 3억 이상 분배\n🔹 8억 이상 먹을 시, 키 없는 인원들 2천숲씩 뽀찌지급\n🔹 엘나, 바드 인원 비율 상관없이 신청부탁드립니다.', value: '\n' },
			{ name: `${text}`, value: `\u200B` },
			{ name: '\u200B', value: '**` 🧡 바드 스펙 조건`**' },
			{ name: '`보호`', value: '130 ⬆️ ', inline: true },
			{ name: '`전장`', value: '보연 47% ⬆️ / 신들 58% ⬆️', inline: true },
			{ name: '`주딜 (너클 / 활)`', value: '맥 1400 ⬆️ ', inline: true },
			{ name: '`힐링원드`', value: '캐속 17레벨 ⬆️ ', inline: true },
			{ name: '\u200B', value: '**` ❤️ 엘나 스펙 조건`**' },
			{ name: '`보호`', value: '150 ⬆️ ', inline: true },
			{ name: '`양손검`', value: '피어싱4 ⬆️ / 맥 1700 ⬆️ ', inline: true },
			{ name: '`주딜`', value: '1400 ⬆️ ', inline: true }
 
		).setFooter({text: '참여는 아래 ❤를 눌러주세요 [선착순 반영]'});

    return embed;
}

function createFinishParty(content) {
	let embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[글렌 어려움 파티원 구인]`**')
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
				embeds: [createFinishParty(`엘나 : ${attackers} \n세바 : ${supporters}`)]
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
		.setName('글렌어렴')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .addStringOption(option => option.setName('메모').setDescription('코멘트'))
        .setDescription('글렌 베르나 어려움 파티원 구인'),

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
		interaction.channel.send('<@&1107301143509467136>');
	}
};
