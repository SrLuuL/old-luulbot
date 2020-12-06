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
let lastMessage = {};



client.on('connected', async () => {
	await db.query(` UPDATE luulbot_info SET value = ${Date.now()} WHERE setting = 'uptime' `)
	await db.query(` UPDATE luulbot_info SET value = 0 WHERE setting = 'command_count' `)
})

client.on('notice', async (channel, msgid, message) => {
	
	let channelFixed = channel.replace('#', '');
	
	if (msgid === 'msg_banned' && channels.includes(channelFixed)) {
		await db.query(`DELETE FROM luulbot_channels WHERE userchannel = '${channelFixed}'`)
		let index =  channels.indexOf(channelFixed)
		channels.splice(index, 1)
		client.part(channelFixed)
		console.log(`LuuLBot está banido em ${channelFixed}, desconectando...`)
	}
	
	switch(msgid) {
		case 'no_permission':
			await sendMsg('não tenho permissão para isso', channel);
			break;
		case 'msg_rejected_mandatory':
			let reply = 'não posso enviar esta mensagem'
			if (reply === message) return;
		        console.log(`Mensagem ${message} não enviada em ${channel}`)
			await sendMsg(reply, channel)
			break;
	}
})


client.on('message', (channel, user, message, self) => handleMSG(channel, user, message, self));



async function handleMSG(channel, user, message, self) {
	
	
	let username = user.username
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift();
	let canal = channel.replace("#", "");
	let msgType = user['message-type']
	
	let streamModeDB = await db.query(`SELECT stream_mode FROM luulbot_channels WHERE userchannel = '${canal}'`);
        let streamMode = streamModeDB.rows[0]['stream_mode'];
	
	let streamStatusDB = await db.query(`SELECT status FROM luulbot_channels WHERE userchannel = '${canal}'`);
	let streamStatus = streamStatusDB.rows[0]['status'];

	if (self){
		
		if (user.badges) {
			
		   if (user.badges.moderator || user.badges.broadcaster) {
			  await db.query(`UPDATE luulbot_channels SET mode='Moderador' WHERE userchannel = '${canal}'`)
		   } else if (user.badges.vip) {
			   await db.query(`UPDATE luulbot_channels SET mode='Vip' WHERE userchannel = '${canal}'`)		
		   } else {
			  await db.query(`UPDATE luulbot_channels SET mode='Viewer' WHERE userchannel = '${canal}'`)		
		   }
			
		}
		
	   return;
	}
	
	if (!message.startsWith(prefix)) return;
	if (message.slice(prefix.length).startsWith(' ')) return;
        if (globalDelay.has(channel)) return;



let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))


if (cmdfile) {
	
	let {name: cmdName, level: cmdPerm, cooldown: cmdCD} = cmdfile.config

	if (commandCD.has(`${username}-${cmdName}`)) return;
	if (streamStatus === 'live' && streamMode) {	
		if(cmdName !== 'modostream') return;	
	}
	
	
        // Permission handler
	switch(cmdPerm) {
	case 'Dono':
		if (username !== 'srluul') return;
		break;
	case 'Moderador':
		if (!user.badges.moderator || !user.badges.broadcaster || username !== 'srluul') return;
		break;	
	case 'Privado':
		if (msgType === 'whisper') return;
		let cmdPermDB = await db.query(`SELECT * FROM luulbot_perms WHERE channel = '${canal}' AND command = '${cmdName}'`)
		if (!cmdPermDB.rowCount) return; 
}
	
	
	
	await db.query(` UPDATE luulbot_info SET value = value + 1 WHERE setting = 'command_count' `)
	
	// Command execution
	
	const context = {
		args: args,
		user: user,
		channel: channel,
		cmd: cmd,
		alias: alias,
		client: client
	}

	
	const cmdExecution = await cmdExec(cmdfile, context);
	
	if(msgType === 'chat') {
		await sendMsg(cmdExecution, channel)
	} else if(msgType === 'whisper') {
		await client.whisper(username, `${cmdExecution}`)
	}
	
	
	// Cooldown handler
	commandCD.add(`${username}-${cmdName}`)
	
	let channelModeDB = await db.query(`SELECT * FROM luulbot_channels WHERE userchannel = '${canal}'`);
	let channelMode = channelModeDB.rows[0].mode;
	
	switch(channelMode) {
		case 'Moderador':
		case 'Vip':
			globalDelay.add(channel);
			setTimeout(() => { globalDelay.delete(channel) }, 800);
			break;
		default:
			globalDelay.add(channel);
			setTimeout(() => { globalDelay.delete(channel) }, 1500);
	}
	
	setTimeout(() => {
	commandCD.delete(`${username}-${cmdName}`)
}, cmdCD);

	
	
	
}

	
}


async function cmdExec(cmdfile, context) {
	
	try {

        let cmdRun = await cmdfile.run(context);
        let cmdReply  = cmdRun.reply
	
	if(cmdRun.mode === 'say') return `${cmdReply}`

		
	return `${context.user.username}, ${cmdReply}`
		
	} catch(err) {
		return `${context.user.username}, comando inválido avise SrLuuL sobre isso`
	}
}

async function sendMsg(message, channel) {
	
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

