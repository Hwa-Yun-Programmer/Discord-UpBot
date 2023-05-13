const {SlashCommandBuilder, InteractionResponse, EmbedBuilder} = require('discord.js');

const filter = (reaction, user) => {
	return ['🔴', '🔵', '🛑'].includes(reaction.emoji.name)
};

function createRecruitParty(date, time) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[글렌베르나 어려움 파티원 구인]`**')
        .setDescription(`**일시 : ${date} ${time}**`)
        .addFields(
			{
				name : ' 🔹 부족한 인원은 따로 모집할 예정입니다. \n🔹 길드원들은 키 있는 인원들끼리 억분 , 지인/공팟은 3억 이상 분배 \n🔹 8억 이상 먹을 시, 키 없는 인원들 2천숲씩 뽀찌지급 \n🔹 엘나, 바드 인원 비율 상관없이 신청부탁드립니다.',
				value : '\u200B'
			}, {
				name : '\u200B',
				value : '**` 🧡 바드 스펙 조건`**'
			}, {
				name : '`보호`',
				value : '130 ⬆️ ',
				inline : true
			}, {
				name : '`전장`',
				value : '보연 47% ⬆️ / 신들 58% ⬆️',
				inline : true
			}, {
				name : '`주딜 (너클 / 활)`',
				value : '맥 1400 ⬆️ ',
				inline : true
			}, {
				name : '`힐링원드`',
				value : '캐속 17레벨 ⬆️ ',
				inline : true
			}, {
				name : '\u200B',
				value : '**` ❤️ 엘나 스펙 조건`**',
			}, {
				name : '`보호`',
				value : '150 ⬆️ ',
				inline : true
			}, {
				name : '`양손검`',
				value : '피어싱4 ⬆️ / 맥 1700 ⬆️ ',
				inline : true
			}, {
				name : '`주딜`',
				value : '1400 ⬆️ ',
				inline : true
			}, 
		)
        .setFooter({text: '참여는 아래 ❤를 눌러주세요 [선착순 반영]'});

    return embed;
}
function createFinishParty() {
	const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('**`[글렌베르나 어려움 파티원 구인]`**')
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
        .setName('글렌어려움')
        .addStringOption(option => option.setName('날짜').setDescription('파티 출발 일자'))
        .addStringOption(option => option.setName('시간').setDescription('파티 출발 시간'))
        .setDescription('글렌베르나 어려움 파티원 구인'),
        
    async execute(interaction) {
        const date = interaction.options.getString('날짜') ?? '상호협의';
        const time = interaction.options.getString('시간') ?? '상호협의';

        await interaction
            .reply({embeds: [createRecruitParty(date, time)], fetchReply: true})
            .then((message) => {
                message.react('❤️').then(() => message.react('🧡'));
                createCollector(message, interaction);
            })
        
    }
};