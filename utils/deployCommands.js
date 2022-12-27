import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { config } from 'dotenv';
import { default as commands } from '../routes/commands.js';

// Intialized env
config();

const jsonCommands = [];
for (const command of commands) {
	jsonCommands.push(command.data.toJSON());
}

// Initialied REST API for Discord.js
const rest = new REST({ version : '10' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.AKASHIC_SERVER_ID), { body:jsonCommands })
	.then(() => console.log('Application Commands register succesfully in Akashic Server.'))
	.catch(console.error);

if(!process.env.DEBUG_MODE) {
	console.log("Mugyuu~");
	// rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.VNL_SERVER_ID), { body:jsonCommands })
	// 	.then(() => console.log('Application Commands register succesfully in VNL Server.'))
	// 	.catch(console.error);
}