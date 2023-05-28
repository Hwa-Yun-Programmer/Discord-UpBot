const {SlashCommandBuilder, InteractionResponse, EmbedBuilder} = require('discord.js');

const filter = (reaction, user) => {
	return ['❤️', '🛑'].includes(reaction.emoji.name)
};

function createRecruitParty(date, time, text) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[글렌 쉬움 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields({
			name: '글렌 베르나 선행퀘스트 완료 ( 종합 전투레벨 1500 ⬆️ ) ',
			value: '\n'
		}, {
            name: `${text}`,
			value: `\u200B`
        }, {
            name: '**`아르카나 레벨 `**',
            value: '50레벨',
            inline: true
        }, {
            name: '**`에르그 레벨`**',
            value: '50레벨 ⬆️',
            inline: true
        }
		).setFooter({text: '참여는 아래 ❤를 눌러주세요 [선착순 반영]'});

    return embed;
}
function createFinishParty() {
	const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[글렌 쉬움 파티원 구인]`**')
        .addFields({
            name: '\u200B',
            value: '**모집 완료**'
        });
    return embed;
};

function createCollector(message, interaction) {
	const collector = message.createReactionCollector({filter, max: 99, dispose: true});
	const players = [];

	collector.on('collect', (reaction, user) => {

		if (user.tag !== '업타운#9665') {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
			switch (reaction.emoji.name) {
                case '❤️':
                    players.push(user.id);
                    break;

                case '🛑':
                    if(user.tag === interaction.user.tag) {
                        var attackers = '';
                        players.forEach((item) => {
                            attackers += `<@${item}> `
                        });
        
                        interaction.followUp({content : `파티원 : ${attackers}`, embeds: [createFinishParty()]});
                        collector.stop();
                    }
                    break;

            }
    	}
	});

	collector.on('remove', (reaction, user) => {
    	if (reaction.emoji.name === '❤️') {
        	players.forEach((item, index) => {
            	if (user.id == item) {
                	players.splice(index, 1);
            	}
        	});
    	}
	});
	return collector;
};


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

        await interaction
            .reply({embeds: [createRecruitParty(date, time, comment)], fetchReply: true})
            .then((message) => {
                message.react('❤️').then(() =>  message.react('🛑'));
                createCollector(message, interaction);
            })
        
    }
};