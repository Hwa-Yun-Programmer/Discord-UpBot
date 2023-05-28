const {SlashCommandBuilder, InteractionResponse, EmbedBuilder} = require('discord.js');

const filter = (reaction, user) => {
	return ['❤️', '🧡', '🛑'].includes(reaction.emoji.name)
};

function createRecruitParty(date, time, boss, text) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[아발론 정화 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
        {
            name: '**`타겟 보스`**',
            value: boss,
            inline: true
        }, {
            name: '**`딜러 모집 조건`**',
            value: '맥 1250 ⬆️',
            inline: true
        }, {
            name: '**`서포터 모집 조건`**',
            value: '서포트샷 세트 보유',
            inline: true
        }, {
            name: `\u200B`,
			value: `${text}`
        }, 
        ).setFooter({text: '참여는 아래 ❤를 눌러주세요 [선착순 반영]'});

    return embed;
}
function createFinishParty() {
	const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[아발론 정화 파티원 구인]`**')
        .addFields({
            name: '**모집완료**',
            value: '\u200B'
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
        
                        interaction.followUp({content : `딜러 : ${attackers} \n서포터 : ${supporters}`, embeds: [createFinishParty()]});
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
        .setName('정화')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .addStringOption((option) => option
			.setName('보스')
			.setDescription('정화 보스 종류')
			.addChoices(
				{ name: '티아가', value: '티아가' },
				{ name: '아켈론', value: '아켈론' },
				{ name: '크리그', value: '크리그' },
			))
        .addStringOption(option => option.setName('메모').setDescription('코멘트'))
        .setDescription('정화 파티원 구인'),
        
    async execute(interaction) {
        const date = interaction.options.getString('날짜') ?? '상호협의';
        const time = interaction.options.getString('시간') ?? '상호협의';
        const boss = interaction.options.getString('보스') ?? '상호협의';
        const comment = interaction.options.getString('메모') ?? '\u200B';

        await interaction
            .reply({embeds: [createRecruitParty(date, time, boss, comment)], fetchReply: true})
            .then((message) => {
                message.react('❤️').then(() => message.react('🧡')).then(() => message.react('🛑'));
                createCollector(message, interaction);
            })
        
    }
};