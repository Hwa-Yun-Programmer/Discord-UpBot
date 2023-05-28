const {SlashCommandBuilder, InteractionResponse, EmbedBuilder} = require('discord.js');

const filter = (reaction, user) => {
	return ['❤️', '🧡', '🛑'].includes(reaction.emoji.name)
};

function createRecruitParty(date, time, text) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[크롬바스 30 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields({
			name: '실린더 에르그 45 이상 / 주딜 맥 1250이상',
			value: '\n'
		}, {
            name: `${text}`,
			value: `\u200B`
        }, {
            name: '**`특성`**',
            value: '프라 / 상지 보유',
            inline: true
        }, {
            name: '**`주딜 조건`**',
            value: '맥 1250 ⬆️',
            inline: true
        }, {
            name: '**`홀샷 별도 모집`**',
            value: '🧡 눌러주세요',
            inline: true
        },)
        .setFooter({text: '참여는 아래 ❤를 눌러주세요 [선착순 반영]'});

    return embed;
}
function createFinishParty() {
	const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[크롬바스 30 파티원 구인]`**')
        .addFields({
            name: '\u200B',
            value: '**모집 완료**'
        });
    return embed;
};

function createCollector(message, interaction) {
	const collector = message.createReactionCollector({filter, max: 99, dispose: true});
	const attack = [];
    const support = [];

	collector.on('collect', (reaction, user) => {

		if (user.tag !== '업타운#9665') {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
			switch (reaction.emoji.name) {
                case '❤️':
                    attack.push(user.id);
                    break;
            
                case '🧡':
                    support.push(user.id);
                    break;

                case '🛑':
                    if(user.tag === interaction.user.tag) {
                        var attackers = '';
                        attack.forEach((item) => {
                            attackers += `<@${item}> `
                        });
                        var supporters = '';
                        support.forEach((item) => {
                            supporters += `<@${item}> `
                        });
        
                        interaction.followUp({content : `파티원 : ${attackers} \n홀샷러 : ${supporters}`, embeds: [createFinishParty()]});
                        collector.stop();
                    }
                    break;

            }
    	}
	});

	collector.on('remove', (reaction, user) => {
    	if (reaction.emoji.name === '❤️') {
        	attack.forEach((item, index) => {
            	if (user.id == item) {
                	attack.splice(index, 1);
            	}
        	});
    	}
        if (reaction.emoji.name === '🧡') {
        	support.forEach((item, index) => {
            	if (user.id == item) {
                	support.splice(index, 1);
            	}
        	});
    	}
    	console.log(attack + support)
	});
	return collector;
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName('크롬30')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .addStringOption(option => option.setName('메모').setDescription('코멘트'))
        .setDescription('크롬바스 30 파티원 구인'),
        
    async execute(interaction) {
        const date = interaction.options.getString('날짜') ?? '상호협의';
        const time = interaction.options.getString('시간') ?? '상호협의';
        const comment = interaction.options.getString('메모') ?? '\u200B';

        await interaction
            .reply({embeds: [createRecruitParty(date, time, comment)], fetchReply: true})
            .then((message) => {
                message.react('❤️').then(() => message.react('🧡')).then(() => message.react('🛑'));
                createCollector(message, interaction);
            })
        
    }
};