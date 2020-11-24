const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");
const db = require('./clients/database.js').db;
const channels = require("./credentials/login.js").channelOptions;

let prefix = "=";
let commandCD = new Set();
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


client.on('message', (channel, user, message, self) => handleMSG(channel, user, message, self));

client.on('whisper', (channel, user, message, self) => handleMSG(channel, user, message, self));

async function handleMSG(channel, user, message, self) {
	
	console.log(channel, message, user, self)
	
	let username = user.username
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();
	let canal = channel.replace("#", "");
	let msgType = user['message-type']
	

	if (self) return;
	if (!message.startsWith(prefix)) return;
	if (message.slice(prefix.length).startsWith(' ')) return;
        if (globalDelay.has(channel)) return;



let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))


if (cmdfile) {
	
	let {name: cmdName, level: cmdPerm, cooldown: cmdCD} = cmdfile.config

	if (commandCD.has(`${username}-${cmdName}`)) return;
	
	
        // Permission handler
	switch(cmdPerm) {
	case 'Dono':
		if (username !== 'srluul') return;
		break;
	case 'Privado':
		let cmdPermDB = await db.query(`SELECT * FROM luulbot_perms WHERE channel = '${canal}' AND command = '${cmdfile.config.name}'`)
		if (!cmdPermDB.rowCount) return; 
}
	
	
	
	await db.query(` UPDATE luulbot_info SET value = value + 1 WHERE setting = 'command_count' `)
	
	// Command execution
	
	const context = {
		args: args,
		user: username,
		channel: channel,
		cmd: cmd,
		alias: alias,
		client: client
	}

	const cmdRun = await cmdfile.run(context);
	const cmdReply = cmdRun.reply
	
	const cmdExecution = await cmdExec(username, cmdRun, cmdReply);
	
	if(msgType === 'chat') {
		await client.say(channel, `${cmdExecution}`)
	} else if(msgType === 'whisper') {
		await client.whisper(username, `${cmdExecution}`)
	}
	
	
	// Cooldown handler
	commandCD.add(`${username}-${cmdName}`)
	globalDelay.add(channel);
	
	setTimeout(() => {
	commandCD.delete(`${username}-${cmdName}`)
}, cmdCD);

setTimeout(() => {
	globalDelay.delete(channel)
}, 1350);	
	
	
}

	
}


async function cmdExec(username, cmdRun, cmdReply) {
	
	try {
	
	if(cmdRun.mode === 'say') return `${cmdReply}`
			
	return `${username}, ${cmdReply}`
		
	} catch(err) {
		return 'Erro desconhecido'
	}
}


