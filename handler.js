const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");
const db = require('./clients/database.js').db;
const channels = require("./credentials/login.js").channelOptions;

let prefix = "=";
let globalCD = new Set();
let globalDelay = new Set();
let cmd = luulbot.commands;
let alias = luulbot.aliases;

client.on('connected', async () => {
	await db.query(` UPDATE luulbot_info SET value = ${Date.now()} WHERE setting = 'uptime' `)
	await db.query(` UPDATE luulbot_info SET value = 0 WHERE setting = 'command_count' `)
})

client.on('notice', async (channel, msgid, message) => {
	let channelFixed = channel.replace('#', '');
	
	if (msgid === 'msg_banned' && channels.includes(channelFixed)) {
		await db.query(` DELETE FROM luulbot_channels WHERE userchannel = '${channelFixed}' `)
		let index =  channels.indexOf(channelFixed)
		channels.splice(index, 1)
		client.part(channelFixed)
		console.log(`LuuLBot está banido em ${channelFixed}, desconectando...`)
	}
	
})

client.on('message', async (channel, user, message, self) => {
	
	let username = user.username
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();
	let canal = channel.replace("#", "");
	
	

	if (self) return;	
	if (globalCD.has(username)) return;
	if (globalDelay.has(channel)) return;
	if (!message.startsWith(prefix)) return;
	if (message.slice(prefix.length).startsWith(' ')) return;



let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))
let cmdPerm = cmdfile.config.level

let cmdPermDB = await db.query(`SELECT * FROM luulbot_perms WHERE channel = '${canal}' AND command = '${cmdfile.config.name} OR command_alias = '${cmdfile.config.aliases.join(' ')}'`)

switch(cmdPerm) {
	case 'Dono':
		if (username !== 'srluul') return;
	case 'Privado':
		if (!cmdPermDB.rows) return;    
}
	
	

if (cmdfile) {
	await db.query(` UPDATE luulbot_info SET value = value + 1 WHERE setting = 'command_count' `)
	cmdfile.run(client, message, args, username, channel, cmd, alias);
	globalCD.add(username);
	globalDelay.add(channel);
}


	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

setTimeout(() => {
	globalDelay.delete(channel)
}, 250);	
	
	
	
});



