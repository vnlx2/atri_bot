import { Collection } from "discord.js";
import commands from '../routes/commands.js';
import akashicCommands from "../routes/akashicCommands.js";

export default (client) => {    
    client.commands = new Collection();

    // Set VNL commands
    for(const command of commands) {
        if('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
    
    // Set akashic commands
    for (const command of akashicCommands) {
        if('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
}

