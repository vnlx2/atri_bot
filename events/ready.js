module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`System Ready, Logged as ${client.user.tag}`);
		console.log(`Uptime: ${Date(Date.now()).toString()}`);
	},
};