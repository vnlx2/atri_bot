import { Collection } from "discord.js";
import commands from '../routes/commands.js';

export default (client) => {    
    client.commands = new Collection();
    for(const command of commands) {
        if('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
}

