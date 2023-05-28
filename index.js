const {Client, REST, GatewayIntentBits, Partials, Collection} = require("discord.js");
const YoutubePoster = require("discord-youtube");

const {DisTube} = require("distube");
const {SpotifyPlugin} = require("@distube/spotify");
const {DeezerPlugin} = require("@distube/deezer");

const {loadEvents} = require("./Handlers/eventHandler");
const {loadCommands} = require("./Handlers/commandHandler");

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)]
});

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    nsfw: true,
    leaveOnFinish: true, // you can change this to your needs
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin(), new DeezerPlugin({ parallel: true })]
});
client.ytp = new YoutubePoster(client, {loop_delay_in_min: 1});
client.commands = new Collection();
client.config = require("./config.json");

module.exports = client;

client
    .login(client.config.token)
    .then(() => {
        loadEvents(client);
        loadCommands(client);
    });
