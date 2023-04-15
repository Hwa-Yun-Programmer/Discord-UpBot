const { ActivityType } = require('discord.js');
const config = require("../../config.json");
require("colors");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`[ONLINE]`.green + ` ${client.user.tag} is online in ${client.guilds.cache.size} servers! `);
    },
};