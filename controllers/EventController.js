import events from '../routes/events.js';

export default (client) => {
    for (const event of events) {
        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}