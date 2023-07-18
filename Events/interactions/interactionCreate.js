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
	embedLength
} = require("discord.js");

const { ViewChannel, SendMessages, ReadMessageHistory, } = PermissionFlagsBits;
const { createTranscript } = require("discord-html-transcripts");
const config = require("../../config.json");

const webhookClient = new WebhookClient({ id: config.webhookId, token: config.webhookToken });

module.exports = {
	name: "interactionCreate",

	async execute(interaction, client) {
		const { customId, values, fields, member, user, guild, commandName, channel, guildId, message, } = interaction;

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
			if (customId == "rules-select") {
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
				interaction.reply({ content : '역활이 정상적으로 변경되었습니다.', ephemeral: true }).then(msg => {
					setTimeout(() => msg.delete(), 10000)
				});
			}
		} else if (interaction.isButton()) {
			if (customId == "join") {
				interaction.deferUpdate();

				const embed = new EmbedBuilder(message.embeds[1]);
				const userId = `<@${user.id}>`;

				if (embed.data.fields) {
					let found = embed.data.fields.some(field => field.value.includes(userId));
				
					if(found) {
						embed.data.fields = embed.data.fields.filter(field => field.value !== userId);
					} else {
						embed.addFields({ name : `\u200B`, value : userId, inline : true});
					}
				} else {
					embed.addFields({ name : `\u200B`, value : userId, inline : true});
				}
				message.edit({ embeds: [message.embeds[0], embed] });
			}
			if (customId == "knight") {
				interaction.deferUpdate();

				const embed = new EmbedBuilder(message.embeds[1]);
				const userId = `<@${user.id}>`;

				if (embed.data.fields) {
					let found = embed.data.fields.some(field => field.value.includes(userId));
				
					if(found) {
						embed.data.fields = embed.data.fields.filter(field => field.value !== userId);
					} else {
						embed.addFields({ name : `\u200B`, value : userId, inline : true});
					}
				} else {
					embed.addFields({ name : `\u200B`, value : userId, inline : true});
				}
				embed.data.title = '**`[엘나 현재 목록 인원]`** ' + embed.data.fields.length + ' 명';
				message.edit({ embeds: [message.embeds[0], embed, message.embeds[2]] });
			}
			if (customId == "bard") {
				interaction.deferUpdate();

				const embed = new EmbedBuilder(message.embeds[2]);
				const userId = `<@${user.id}>`;

				if (embed.data.fields) {
					let found = embed.data.fields.some(field => field.value.includes(userId));
				
					if(found) {
						embed.data.fields = embed.data.fields.filter(field => field.value !== userId);
					} else {
						embed.addFields({ name : `\u200B`, value : userId, inline : true});
					}
				} else {
					embed.addFields({ name : `\u200B`, value : userId, inline : true});
				}
				embed.data.title = '**`[바드 현재 목록 인원]`** ' + embed.data.fields.length + ' 명';
				message.edit({ embeds: [message.embeds[0], message.embeds[1], embed] });
			}
			if (customId == "confirm_glenn") {
				if(user.id === message.interaction.user.id) {
					interaction.deferUpdate();

					const embed1 = new EmbedBuilder(message.embeds[1]);
					embed1.setTitle('**`[엘나 파티원 모집 완료]`**')
					embed1.setFooter({text : '파티 총원보다 초과해서 모집된경우 참여가 불가능합니다.'});
					embed1.setColor(0xff0000)

					const embed2 = new EmbedBuilder(message.embeds[2]);
					embed2.setTitle('**`[바드 파티원 모집 완료]`**')
					embed2.setFooter({text : '파티 총원보다 초과해서 모집된경우 참여가 불가능합니다.'});
					embed2.setColor(0xff0000)

					message.edit({ embeds: [message.embeds[0], embed1, embed2], components: [] });
				} else {
					interaction.reply({ content : '파티장만 모집완료를 할 수 있습니다.', ephemeral: true }).then(msg => {
						setTimeout(() => msg.delete(), 10000)
					});
				}
			}
			if (customId == "confirm") {
				if(user.id === message.interaction.user.id) {
					interaction.deferUpdate();

					const embed = new EmbedBuilder(message.embeds[1]);
					embed.setTitle('**`[파티원 모집 완료]`**')
					embed.setFooter({text : '파티 총원보다 초과해서 모집된경우 참여가 불가능합니다.'});
					embed.setColor(0xff0000)
					message.edit({ embeds: [message.embeds[0], embed], components: [] });
				} else {
					interaction.reply({ content : '파티장만 모집완료를 할 수 있습니다.', ephemeral: true }).then(msg => {
						setTimeout(() => msg.delete(), 10000)
					});
				}
			}
		}
	},
};