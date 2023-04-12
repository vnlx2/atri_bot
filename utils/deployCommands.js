import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import dotenv from 'dotenv';
import { default as commands } from '../routes/commands.js';
import { default as akashicCommands } from '../routes/akashicCommands.js';

// Intialized env
dotenv.config();

const jsonCommands = [];
const akashicJsonCommands = [];

for (const command of commands) {
	jsonCommands.push(command.data.toJSON());
}

for (const command of akashicCommands) {
	akashicJsonCommands.push(command.data.toJSON());
}

// Initialied REST API for Discord.js
const rest = new REST({ version : '10' }).setToken(process.env.BOT_TOKEN);

if (process.env.DEBUG_MODE === 'true') {
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.APP_ID, process.env.AKASHIC_SERVER_ID),
			{ body:jsonCommands }
		);
		console.log('Application Commands register succesfully in Akashic Server.');
	} catch (err) {
		console.error(err);
	}
}

if (process.env.DEBUG_MODE === 'false') {
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.APP_ID, process.env.VNL_SERVER_ID),
			{ body:jsonCommands }
		);
		console.log('Application Commands register succesfully in VNL Server.');
	} catch (err) {
		console.error(err);
	}
}

if (akashicJsonCommands.length > 0) {
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.APP_ID, process.env.AKASHIC_SERVER_ID),
			{ body:akashicJsonCommands }
		);
		console.log('Special Commands register succesfully in Akashic Server.');
	} catch (err) {
		console.error(err);
	}
}