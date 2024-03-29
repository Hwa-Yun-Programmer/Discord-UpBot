/* eslint-disable no-unused-vars */
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = async (client, queue, song) => {

    let duration = song.duration * 1000;

    const pauseButton = new ButtonBuilder()
		.setStyle('Success')
        .setLabel('Pause & Resume')
        .setCustomId('pauseId');
    const skipButton = new ButtonBuilder()
		.setStyle('Primary')
        .setLabel('Skip')
        .setCustomId('skipId');
    const stopButton = new ButtonBuilder()
		.setStyle('Danger')
        .setLabel('Stop')
        .setCustomId('stopId');
    const queueButton = new ButtonBuilder()
		.setStyle('Secondary')
        .setLabel('Show Queue')
        .setCustomId('queueId');

    const row = new ActionRowBuilder()
		.addComponents([ pauseButton, skipButton, stopButton, queueButton ]);

    let thing = new EmbedBuilder()
        .setColor(client.color)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Request by ${song.user.tag}`, iconURL: song.user.displayAvatarURL() });

    if (song.playlist) {
        thing.setDescription(`${client.emoji.playlist} | Start playing playlist \n[${song.playlist.name}](${song.playlist.url}) \`[${song.playlist.songs.length} songs]\`\n\n${client.emoji.music} | Start playing \n[${song.name}](${song.url}) - \`[${song.formattedDuration}]\``);

        let embed = await queue.textChannel.send({ embeds: [ thing ], components: [ row ] });

        setTimeout(() => { 
            embed.delete().catch(error => {
                if (error.code === 10008) return;
            });
        }, duration);

        await playButton(queue, duration, embed, song)

    } else {
        thing.setDescription(`${client.emoji.music} | Start playing \n[${song.name}](${song.url}) - \`[${song.formattedDuration}]\``);

        let embed = await queue.textChannel.send({ embeds: [ thing ], components: [ row ] });

        setTimeout(() => { 
            embed.delete().catch(error => {
                if (error.code === 10008) return;
            });
        }, duration);

        await playButton(queue, duration, embed, song)
    }

}


async function playButton(queue, duration, embed, song) {
    const collector = embed.createMessageComponentCollector({ 
        filter: (interaction) => queue.voiceChannel.members.has(interaction.user.id),
        time: duration,
        componentType: 2
    });

    collector.on('collect', async i => {
        if (queue.songs[0] !== song) return i.message.delete();

        let embeds = new EmbedBuilder()
            .setColor(i.client.color)
            .setFooter({ text: `Request by ${i.user.tag}`, iconURL: i.user.displayAvatarURL() });
        
        if (i.customId === 'pauseId') {
            if (queue.paused) { 
                i.client.distube.resume(i.message);
                embeds.setDescription(`${i.client.emoji.resume} | **Resume** a song.`);
                i.reply({ embeds: [embeds] });
            } else {
                i.client.distube.pause(i.message);
                embeds.setDescription(`${i.client.emoji.pause} | **Pause** a song.`);
                i.reply({ embeds: [embeds] });
            }
        } else if (i.customId === 'skipId') {
            i.client.distube.skip(i.message)
            .then(song => {
                embeds.setDescription(`${i.client.emoji.skip} | **Skip** a song.`);
                i.reply({ embeds: [embeds] });
                i.message.delete();
            })
            .catch(error => {
                if (error.code === "NO_UP_NEXT") {
                    i.client.distube.stop(i.message)
                    .then(song => {
                        embeds.setDescription(`${i.client.emoji.skip} | **Skip** a song.`);
                        i.reply({ embeds: [embeds] });
                        i.message.delete();
                    })
                    .catch(error => {
                        return i.reply(`${i.client.emoji.error} | An error occurred while skip the song.`); 
                    });
                } else {
                    return i.reply(`${i.client.emoji.error} | An error occurred while skip the queue.`); 
                }
            });
        } else if (i.customId === 'stopId') {
            i.client.distube.stop(i.message);
            embeds.setDescription(`${i.client.emoji.stop} | **Stopped** the music.`);
            i.reply({ embeds: [embeds] });
            i.message.delete();
        } else if (i.customId === 'queueId') {
            const arrays = queue.songs.map((song, id) => `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``); 

            const embed = new EmbedBuilder()
                .setColor("BLACK")
                .setTitle(`${i.client.emoji.queue} Queue:`)
                .setFooter({ text: `Request by ${i.user.tag} • ${i.client.footer.status(queue)}`, iconURL: i.user.displayAvatarURL() });
                

            const footer = "songs";
            const timeout = 120000;

            await button(i, arrays, embed, footer, timeout);
        }
    });
}

async function button(i, arrays, embed, footer, timeout) {

    const backId = 'back';
    const forwardId = 'forward';
    const backButton = new ButtonBuilder({
        style: 'Secondary',
        label: 'Back',
        emoji: '⏪',
        customId: backId
    });
    const forwardButton = new ButtonBuilder({
        style: 'Secondary',
        label: 'Forward',
        emoji: '⏩',
        customId: forwardId
    });

    const array = arrays;

    const generateEmbed = async start => {
        const current = array.slice(start, start + 10);
        
        embed.setDescription(current.join('\n') + `\n\nShowing ${footer} ${start + 1}-${start + current.length} out of ${array.length}`);
        return embed;
    }

    const canFitOnOnePage = array.length <= 10

    const row1 = new ActionRowBuilder()
        .addComponents([ forwardButton ]);

    const embeds = await generateEmbed(0)

    const embedMessage = await i.reply({
        embeds: [ embeds ],
        components: canFitOnOnePage ? [] : [ row1 ]
    });

    if (canFitOnOnePage) return;

    const collector = embedMessage.createMessageComponentCollector({ 
        filter: ({user}) => user.id === i.user.id, 
        time: timeout,
        componentType: 2
    });

    let currentIndex = 0;

    collector.on('collect', async interaction => {
        interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10)

        const row2 = new ActionRowBuilder()
            .addComponents([ ...(currentIndex ? [backButton] : []), ...(currentIndex + 10 < array.length ? [forwardButton] : []) ]);

        const embed = await generateEmbed(currentIndex);

        await interaction.update({
            embeds: [ embed ],
            components: [ row2 ]
        })
    });
    collector.on("end", collected => {
        embedMessage.edit({ components: [] });
    });
}