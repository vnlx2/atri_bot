import dotenv from 'dotenv';
import logger from './services/logger_service.js';
import { Client, GatewayIntentBits } from 'discord.js';
import CommandController from './controllers/CommandController.js';
import { db } from './configs/database.js';
import EventController from './controllers/EventController.js';

// Intialized env
dotenv.config();

// Get Token
const token = process.env.BOT_TOKEN;

try {
    // Create Discord.js Client Instance
    const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions] });

    // Initialized Command and Event Controller
    CommandController(client);
    EventController(client);

    // Login to Discord with your token
    client.login(token);
}
catch (ex) {
    console.log(ex);
    logger.error(ex);
}

