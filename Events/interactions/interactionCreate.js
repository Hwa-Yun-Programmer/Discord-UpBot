const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ChannelType,
	PermissionFlagsBits,
	resolveColor,
	WebhookClient,
	embedLength,
	ThreadAutoArchiveDuration,
	StringSelectMenuBuilder,
	Embed
} = require("discord.js");

const dungeon = [
	{
		name: '울라던전',
		value: '울라던전',
		sublist: [
			{
				name: '알비던전',
				value: '알비던전',
				level: ['상급', '하드상급', '베테랑'],
			},
			{
				name: '키아던전',
				value: '키아던전',
				level: ['상급', '하드상급', '베테랑']
			},
			{
				name: '마스던전',
				value: '마스던전',
				level: ['상급', '하드상급', '베테랑']
			},
		]
	},
	{
		name: '시드 피나하',
		value: '시드 피나하',
		sublist: [
			{
				name: '호기심',
				value: '호기심',
				level: ['쉬움', '보통', '어려움'],
			},
			{
				name: '두려움',
				value: '두려움',
				level: ['쉬움', '보통', '어려움'],
			},
			{
				name: '슬픔',
				value: '슬픔',
				level: ['쉬움', '보통', '어려움'],
			},
		]
	},
	{
		name: '테흐두인',
		value: '테흐두인',
		sublist: [
			{
				name: '허상',
				value: '되살아난 허상',
				level: ['쉬움', '보통', '어려움', '매어']
			},
			{
				name: '페피',
				value: '페스피아다',
				level: ['쉬움', '보통', '어려움', '매어']
			},
			{
				name: '악몽',
				value: '일곱 번의 악몽',
				level: ['쉬움', '보통', '어려움', '매어']
			},
			{
				name: '군주',
				value: '깨어난 심해의 군주',
				level: ['쉬움', '보통', '어려움', '매어']
			},
		]
	},
	{
		name: '마그멜',
		value: '마그멜',
		sublist: [
			{
				name: '사계의 숲',
				value: '사계의 숲',
				level: ['보통', '어려움']
			},
			{
				name: '역동의 대지',
				value: '역동의 대지',
				level: ['보통', '어려움']
			},
		]
	},
	{
		name: '크롬바스',
		value: '크롬바스',
		sublist: [
			{
				name: '크롬바스',
				value: '크롬바스',
				level: ['30', '50', '100']
			}
		]
	},
	{
		name: '글렌 베르나',
		value: '글렌 베르나',
		sublist: [
			{
				name: '글렌 베르나',
				value: '크글렌 베르나',
				level: ['쉬움', '어려움']
			}
		]
	}
];

const dungeonEmbed = [

]

const client = require("../../index");

const updateEmbedFields = (embed, userId) => {
	if (embed.data.fields) {
		const userTag = `<@${userId}>`;
		let found = embed.data.fields.some(field => field.value.includes(userTag));

		if (found) {
			embed.data.fields = embed.data.fields.filter(field => field.value !== userTag);
		} else {
			embed.addFields({ name: `\u200B`, value: userTag, inline: true });
		}
	} else {
		embed.addFields({ name: `\u200B`, value: `<@${userId}>`, inline: true });
	}
};

const confirmParty = (embed, title) => {
	embed.setTitle(title);
	embed.setFooter({ text: '파티 총원보다 초과해서 모집된경우 참여가 불가능합니다.' });
	embed.setColor(0xff0000);

	return embed;
};

const checkPartyHead = (user, message, interaction) => {
	if (user.id === message.embeds[0].author.name) {
		interaction.deferUpdate();
		return true;
	} else {
		interaction.reply({ content: '파티장만 모집완료를 할 수 있습니다.', ephemeral: true })
			.then(msg => setTimeout(() => msg.delete(), 10000));
		return false;
	}
};

const writeForumOffer = (title, comment, date, interaction) => {
	const dungeonEmbed = [
		{
			name: '울라던전',
			sublist: [

			]
		}
	];
	const forum = client.channels.cache.get("1138797361389371463");

	forum.threads.create({

		name: `${date} ${title}`,

		autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,

		message: {

			content: `${comment}`,

		},

		reason: 'Needed a separate thread for food',

	}).catch(console.error);

};

const userState = {};

module.exports = {
	name: "interactionCreate",

	async execute(interaction, client) {
		const { customId, values, fields, member, user, guild, commandName, channel, guildId, message, } = interaction;

		const updateInteractionWithSelectMenu = async (placeholder, options, customId, contentMessage) => {
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId(customId)
				.setPlaceholder(placeholder)
				.addOptions(options);
			const row = new ActionRowBuilder().addComponents(selectMenu);

			await interaction.update({
				content: contentMessage,
				components: [row]
			});
		};

		const checkPreviousState = (id, stateField) => {
			if (!userState[id]?.[stateField]) {
				interaction.reply('이전 단계의 선택을 완료해주세요.');
				return false;
			}
			return true;
		};

		const userId = interaction.user.id;

		if (interaction.isCommand()) {
			const command = client.commands.get(commandName);

			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.log(error);
				await interaction.reply({ content: '오류발생!', ephemeral: true });

			}
		} else if (interaction.isStringSelectMenu()) {


			switch (interaction.customId) {
				case 'dungeon_select':
					if (userState[userId]?.subDungeon || userState[userId]?.level) {
						await interaction.reply('이전 단계의 선택을 완료해주세요.');
						return;
					}

					const selectedDungeon = dungeon.find(d => d.value === interaction.values[0]);
					if (selectedDungeon) {
						userState[userId] = { dungeon: selectedDungeon.value, subDungeon: null, level: null };
						const subSelectOptions = selectedDungeon.sublist.map(sub => ({ label: sub.name, value: sub.value }));
						await updateInteractionWithSelectMenu('서브 던전 선택', subSelectOptions, 'sub_select', '서브 던전을 선택해주세요.');
					}
					break;

				case 'sub_select':
					if (!checkPreviousState(userId, 'dungeon')) return;
					const currentDungeon = dungeon.find(d => d.value === userState[userId].dungeon);
					const selectedSubDungeon = currentDungeon.sublist.find(sub => sub.value === interaction.values[0]);
					if (selectedSubDungeon) {
						userState[userId].subDungeon = selectedSubDungeon.value;
						const levelOptions = selectedSubDungeon.level.map(level => ({ label: level, value: level }));
						await updateInteractionWithSelectMenu('레벨 선택', levelOptions, 'level_select', '레벨을 선택해주세요.');
					}
					break;

				case 'level_select':
					if (!checkPreviousState(userId, 'subDungeon')) return;

					userState[userId].level = interaction.values[0];
					const finalMessage = `선택 완료: ${userState[userId].dungeon} > ${userState[userId].subDungeon} > ${userState[userId].level}`;
					setTimeout(() => interaction.message.delete(), 100);
					let button = new ButtonBuilder()
						.setCustomId('submitModal')
						.setLabel('모집완료')
						.setEmoji('<:Calvin_yes:1120378770457628823>')
						.setStyle(ButtonStyle.Danger);



					let row = new ActionRowBuilder().addComponents(button);
					await channel.send({ content: finalMessage, components: [row] });

					break;

				case 'rules-select':
					const component = interaction.component
					const removed = component.options.filter((option) => {
						return !values.includes(option.value)
					})

					for (const id of removed) {
						const role = interaction.guild.roles.cache.find(r => r.name === `${id.value}`);
						member.roles.remove(role)
					}

					for (const id of values) {
						const role2 = interaction.guild.roles.cache.find(r => r.name === `${id}`);
						member.roles.add(role2)
					}
					interaction.reply({ content: '역활이 정상적으로 변경되었습니다.', ephemeral: true }).then(msg => {
						setTimeout(() => msg.delete(), 10000)
					});
					break;
			}
		} else if (interaction.isButton()) {
			switch (customId) {
				case 'join':
					
					interaction.deferUpdate();
					const embed = new EmbedBuilder(message.embeds[1]);
					updateEmbedFields(embed, user.id);
					embed.data.title = '**`[파티원 현재 목록 인원]`** ' + embed.data.fields.length + ' 명';
					message.edit({ embeds: [message.embeds[0], embed] });
					break;

				case 'confirm':
					if (checkPartyHead(user, message, interaction)) {
						confirmParty(new EmbedBuilder(message.embeds[1]), '**`[파티원 모집 완료]`**');
						message.edit({ embeds: [message.embeds[0], embed], components: [] });
					}
					break;

				case "knight":
					interaction.deferUpdate();
					const knightEmbed = new EmbedBuilder(message.embeds[1]);
					updateEmbedFields(knightEmbed, user.id);
					knightEmbed.data.title = '**`[엘나 현재 목록 인원]`** ' + knightEmbed.data.fields.length + ' 명';
					message.edit({ embeds: [message.embeds[0], knightEmbed, message.embeds[2], message.embeds[3], message.embeds[4]] });
					break;

				case "bard":
					interaction.deferUpdate();
					const bardEmbed = new EmbedBuilder(message.embeds[2]);
					updateEmbedFields(bardEmbed, user.id);
					bardEmbed.data.title = '**`[바드 현재 목록 인원]`** ' + bardEmbed.data.fields.length + ' 명';
					message.edit({ embeds: [message.embeds[0], message.embeds[1], bardEmbed, message.embeds[3], message.embeds[4]], });
					break;

				case "mage":
					interaction.deferUpdate();
					const mageEmbed = new EmbedBuilder(message.embeds[3]);
					updateEmbedFields(mageEmbed, user.id);
					mageEmbed.data.title = '**`[닼메 현재 목록 인원]`** ' + mageEmbed.data.fields.length + ' 명';
					message.edit({ embeds: [message.embeds[0], message.embeds[1], message.embeds[2], mageEmbed, message.embeds[4]] });
					break;

				case "stinger":
					interaction.deferUpdate();
					const stingerEmbed = new EmbedBuilder(message.embeds[4]);
					updateEmbedFields(stingerEmbed, user.id);
					stingerEmbed.data.title = '**`[알스 현재 목록 인원]`** ' + stingerEmbed.data.fields.length + ' 명';
					message.edit({ embeds: [message.embeds[0], message.embeds[1], message.embeds[2], message.embeds[3], stingerEmbed] });
					break;

				case "confirm_glenn":
					if (checkPartyHead(user, message, interaction)) {
						const embed1 = confirmParty(new EmbedBuilder(message.embeds[1]), '**`[엘나 파티원 모집 완료]`**');
						const embed2 = confirmParty(new EmbedBuilder(message.embeds[2]), '**`[바드 파티원 모집 완료]`**');
						const embed3 = confirmParty(new EmbedBuilder(message.embeds[3]), '**`[닼메 파티원 모집 완료]`**');
						const embed4 = confirmParty(new EmbedBuilder(message.embeds[4]), '**`[알스 파티원 모집 완료]`**');
						message.edit({ embeds: [message.embeds[0], embed1, embed2, embed3, embed4], components: [] });
					}
					break;

				case "party_offer":
					const dungeonOptions = dungeon.map(d => ({ label: d.name, value: d.value }));
					const dungeonSelectMenu = new StringSelectMenuBuilder()
						.setCustomId('dungeon_select')
						.setPlaceholder('던전 선택')
						.addOptions(dungeonOptions);

					const row = new ActionRowBuilder().addComponents(dungeonSelectMenu);

					await interaction.reply({ content: '원하는 던전을 선택해주세요:', components: [row] });
					break;

				case "submitModal":
					console.log(userState)

					const modal = new ModalBuilder()
						.setCustomId('myModal')
						.setTitle('My Modal');

					const inputFields = [
						{
							label: "파티 제목 설정",
							id: "titleInput",
							value: `${userState[userId].subDungeon} ${userState[userId].level} 파티원 구인A`,
							style: TextInputStyle.Short
						},
						{
							label: "파티 일자 및 시간 설정",
							id: "timeInput",
							value: `${userState[userId].subDungeon} ${userState[userId].level} 파티원 구인B`,
							style: TextInputStyle.Short
						},
						{
							label: "파티 메모 설정",
							id: "commentInput",
							value: `${userState[userId].subDungeon} ${userState[userId].level} 파티원 구인C`,
							style: TextInputStyle.Paragraph
						},
					];

					const inputComponents = inputFields.map(input => {
						return new TextInputBuilder()
							.setCustomId(input.id)
							.setLabel(input.label)
							.setValue(input.value)
							.setStyle(input.style);
					});

					const inputActions = inputComponents.map(inputComponent => {
						return new ActionRowBuilder().addComponents(inputComponent);
					});

					modal.addComponents(...inputActions);

					//delete userState[userId];

					await interaction.showModal(modal);

					const submitted = await interaction.awaitModalSubmit({
						time: 60000,
						filter: i => i.user.id === interaction.user.id,
					}).catch(error => {
						console.error(error)
						return null
					})

					if (submitted) {
						const [title, time, comment] = Object.keys(inputFields).map(key => submitted.fields.getTextInputValue(inputFields[key].id));
						submitted.deferUpdate();
						interaction.message.delete()
						writeForumOffer(title, comment, time, interaction);
						delete userState[userId];
					}
					break;
			}
		}
	},
};