const { REST, Routes } = require('discord.js');
const { clientId, guildIds, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	guildIds.map(async(guildId) => {
		try {
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId), { 
					body: commands 
				});
				console.log(`Started refreshing ${commands.length} application (/) commands.`);
				const data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId), { 
					body: commands,
				});
				console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})
})();