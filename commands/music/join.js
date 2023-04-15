const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('join')
    .setDescription("Play a song")
    .addStringOption(option => option.setName('url').setDescription('제목 or 주소')),
 
    async execute(interaction, args) {
        await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
    }
}