/* eslint-disable indent */
// Import env
const dotenv = require('dotenv');
// Intialized env
dotenv.config();

// Import Discord.js
const { Client, GatewayIntentBits } = require('discord.js');

// Import
const VNDB = require('vndb-api');
const VndbService = require('./service/vndb_service');


// Get Token
const token = process.env.BOT_TOKEN;

// Create Discord.js Client Instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// Create VNDB Client Instance
const vndb = new VNDB('atri', {
    minConnection: 1,
    maxConnection: 10,
});
const test = new VndbService(vndb);

// When the client ready, run this code
client.once('ready', () => {
	console.log('ATRI Ready');
    console.log(`Uptime: ${Date(Date.now()).toString()}`);
    console.log(test.findByName('hanasaki'));
});

// Login to Discord with your token
client.login(token);
