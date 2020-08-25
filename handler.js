const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");


let prefix = "=";
let globalCD = new Set();
let cmd = luulbot.commands;
let alias = luulbot.aliases;



client.on("message", async (channel, user, message, self) => {
	
	let username = user.username
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();
	let canal = channel.replace("#", "");
	
	

	if (self) return;
	
	if (globalCD.has(username)) return;

	if (!message.startsWith(prefix)) return;



let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))

if (cmdfile) {
	cmdfile.run(client, message, args, username, channel, cmd, alias);
	globalCD.add(username);
}


	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

	
	
});



