import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

// Intialized env
dotenv.config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.AKASHIC_SERVER_ID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);