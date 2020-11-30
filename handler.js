const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");
const db = require('./clients/database.js').db;
const channels = require("./credentials/login.js").channelOptions;

let prefix = "=";
let commandCD = new Set();
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
	
	switch(msgid) {
		case 'no_permission':
			client.say(channel, 'não tenho permissão para isso')
			break;
		case 'msg_rejected_mandatory':
			console.log(`Mensagem ${message} não enviada em ${channel}`)
			client.say(channel, 'não posso mandar essa mensagem')
			break;
	}
	
})


client.on('message', (channel, user, message, self) => handleMSG(channel, user, message, self));



async function handleMSG(channel, user, message, self) {
	
	
	let username = user.username
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();
	let canal = channel.replace("#", "");
	let msgType = user['message-type']
	let lastMessage

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

	
	const cmdExecution = await cmdExec(cmdfile, context);
	
	if(msgType === 'chat') {
		await sendMsg(cmdExecution, channel, lastMessage)
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


async function cmdExec(cmdfile, context) {
	
	try {

        let cmdRun = await cmdfile.run(context);
        let cmdReply  = cmdRun.reply
	
	if(cmdRun.mode === 'say') return `${cmdReply}`

		
	return `${context.user}, ${cmdReply}`
		
	} catch(err) {
		return 'comando inválido, avise SrLuuL sobre isso'
	}
}

async function sendMsg(message, channel, lastMessage) {
	
	let inviChar = /\uFFF0/
	
	if(message === lastMessage[channel]) {
		
		if(inviChar.exec(message)) {
			
			message = message.replace(inviChar, '');
			
		} else {
			
			message = inviChar + message	
			
		}
		
	}
	
	lastMessage[channel] = message
	
	await client.say(channel, `${message}`)

}

