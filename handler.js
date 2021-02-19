const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");
const db = require('./clients/database.js').db;
const channels = require("./credentials/login.js").channelOptions;
const moment = require('moment-timezone');

let commandCD = new Set();
let globalDelay = new Set();
let cmd = luulbot.commands;
let alias = luulbot.aliases;
let lastMessage = {};



client.on('connected', async () => {
	await db.query(` UPDATE luulbot_info SET value = ${Date.now()} WHERE setting = 'uptime' `)
	await db.query(` UPDATE luulbot_info SET value = 0 WHERE setting = 'command_count' `)
	
   channels.forEach(async (channel) => {
    
   let channelDB = await db.query(`SELECT * FROM luulbot_channels WHERE userchannel = '${channel}'`);
   let { userchannel, userid, useruid, status, mode, stream_mode } = channelDB.rows[0]
   
   client.Channels.set(channel, { channel: userchannel, id: userid, uid: useruid, status: status, mode: mode, stream_mode: stream_mode } );
    
    })
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
	let canal = channel.replace("#", "");
	let msgType = user['message-type']
	
	let prefixDB = await db.query(`SELECT prefix from luulbot_channels WHERE userchannel='${canal}'`);
	let prefix = prefixDB.rows[0].prefix
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift();
	
	let streamModeDB = await db.query(`SELECT stream_mode FROM luulbot_channels WHERE userchannel = '${canal}'`);
        let streamMode = streamModeDB.rows[0]['stream_mode'];
	
	let streamStatusDB = await db.query(`SELECT status FROM luulbot_channels WHERE userchannel = '${canal}'`);
	let streamStatus = streamStatusDB.rows[0]['status'];

	if (self){
		
	   if(msgType === 'whisper') return;
		
		if (user.badges) {
			
		   if (user.badges.moderator || user.badges.broadcaster) {
			  await db.query(`UPDATE luulbot_channels SET mode='Moderador' WHERE userchannel = '${canal}'`)
		   } else if (user.badges.vip) {
			   await db.query(`UPDATE luulbot_channels SET mode='Vip' WHERE userchannel = '${canal}'`)		
		   }  else {
			   await db.query(`UPDATE luulbot_channels SET mode='Viewer' WHERE userchannel = '${canal}'`)		
		   }
			
		}  else {
			   await db.query(`UPDATE luulbot_channels SET mode='Viewer' WHERE userchannel = '${canal}'`)		
		   }
		
	   return;
	}
	
	if (!message.startsWith(prefix)) return;
        if (globalDelay.has(channel)) return;



let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))


if (cmdfile) {
	
	
	let {name: cmdName, level: cmdPerm, cooldown: cmdCD, family: cmdFamily} = cmdfile.config

	if (commandCD.has(`${username}-${cmdName}`)) return;
	if (streamStatus === 'live' && streamMode) {	
		if(cmdName !== 'modostream') return;	
	}
	
	
	let currentDate = moment.tz(Date.now(), 'America/Bahia').locale('pt').format('LLLL');
	
	const userFetch = await db.query(`SELECT * FROM luulbot_users WHERE userchannel = '${username}'`);
	
	if(!userFetch.rowCount) {
	 let usersLength = await db.query(`SELECT * FROM luulbot_users`);	
	 let userUID = usersLength.rows.length + 1;
	 await db.query(`INSERT INTO luulbot_users(userchannel, userid, useruid, lastchannel, lastcommand, lastseen, commandsused, firstseen) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`, [username, user['user-id'], userUID, channel, command, currentDate, 1, currentDate]);	
	} else {
	 await db.query(`UPDATE luulbot_users SET lastchannel = '${channel}', lastcommand = '${command}', lastseen = '${currentDate}', commandsused = commandsused + 1 WHERE userchannel = '${username}'`);	
	}
	
	await db.query(`UPDATE luulbot_channels SET last_used = '${currentDate}', commands_used = commands_used+1 WHERE userchannel = '${canal}'`)
	
	
        // Permission handler
	switch(cmdPerm) {
	case 'Dono':
		if (username !== 'srluul') return;
		break;
	case 'Moderador':
		if (user.badges) {
		 let modStatus = user.badges.moderator || user.badges.broadcaster;	
		 if (!modStatus) return;	
		} else return;
		break;	
	case 'Privado':
		if (msgType === 'whisper') return;
		let cmdPermDB = await db.query(`SELECT * FROM luulbot_perms WHERE channel = '${canal}' AND command = '${cmdFamily ||cmdName}'`)
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
	
	if(cmdRun.mode === 'say') return `${cmdReply}`;
	if(cmdRun.mode === 'event' && !cmdReply) return '';

		
	return `${context.user.username}, ${cmdReply}`
		
	} catch(err) {
		console.log(err)
		return `${context.user.username}, comando inválido mande uma sugestão alertando o problema`
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

