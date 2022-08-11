/* eslint-disable indent */
// Import env
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

// Intialized env
dotenv.config();

// Import Discord.js
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Get Token
const token = process.env.BOT_TOKEN;

// Create Discord.js Client Instance
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions] });

// Import All Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}


// Import All Commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Create Interaction
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction, client);
    }
    catch (err) {
        console.error(err);
        await interaction.reply({
            content: `An Error has occured. ${err}`,
            ephemeral: true,
        });
    }
});


// Login to Discord with your token
client.login(token);
