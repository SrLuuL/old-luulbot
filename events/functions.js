const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');
const db = require('../clients/database.js').db;
const channels = require('../credentials/login.js').channelOptions;
const ms = require('pretty-ms');
const luulbot = require ("../clients/discord.js").luulbot;
const translateapi = require("@kaysilvn/google-translate-api");
const translate = new translateapi().translate;

client.afkList = [];

async function timedRemindCheck() {
	
  const remindTimeDB = await db.query('SELECT * FROM luulbot_remindtimed');

  let remindTimeCheck = remindTimeDB.rows.find(i => i.time - Date.now() <= 0);

  if(remindTimeCheck) {
    let {userchannel, usersender, channelsender, message, timeparsed, id} = remindTimeCheck;
    let formatedTime = ms(timeparsed - 0, {secondsDecimalDigits: 0});
	  
    await db.query(`DELETE FROM luulbot_remindtimed WHERE id = '${id}'`);
	  
        
	
	let aprilJoke;
	
	
	aprilJoke = `${usersender}, lembrete cronometrado de ${usersender === userchannel ? 'você' : userchannel}:  ${message} (${formatedTime})`
        .split('')
        .map((i,f) => !parseInt(i, 0) && Math.floor(Math.random() * 10) >= 7 ? `${i}${i}`.toUpperCase() : i.toLowerCase())
        .join('');
	
	if(Math.random() * 50 < 1) {
	
	 const randomLanguage = ['de', 'es', 'el', 'zh', 'pl', 'ar'].sort(() => 0.5 - Math.random())[0];
	 aprilJoke = await translate(`${usersender}, lembrete cronometrado de ${usersender === userchannel ? 'você' : userchannel}:  ${message} (${formatedTime})`, {src_lang: 'auto', tar_lang: randomLanguage}); 
	 
	}
	
	

    client.say(channelsender, aprilJoke);
  }

}

setInterval(() => timedRemindCheck(), 1000);




client.on('message', async (channel, user, message, self) => {
  
  let canal = channel.replace("#", ""); 	
  let prefixDB = await db.query(`SELECT prefix from luulbot_channels WHERE userchannel='${canal}'`);
  let prefix = prefixDB.rows[0].prefix
  
	
  let args = message.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift();
  if(self) return;

  const afkCheck = await db.query(`SELECT * FROM luulbot_afk WHERE username = '${user.username}'`);
  const remindCheck = await db.query(`SELECT * FROM luulbot_remind WHERE usersender = '${user.username}'`);
	
  let hossBotRegex = /^(h(o|0)ss)([a-z]|[0-9])/g;
  let fossaFollow = ', obrigado por seguir! peepoGlad'	
	
  if(user.username === 'fossabot' && message.includes(fossaFollow) && canal === 'ghiletofar') {
	  let filteredMessage = message.replace(fossaFollow, '')
	  let botCheck = hossBotRegex.test(filteredMessage)
	  
	  if(botCheck) {
		  client.ban('ghiletofar', `${filteredMessage}`)
	  }
  }
	
	
  let dungeonRegex = /(\+\d+|0) XP/
	
  if(user.username === 'bobotinho' && canal === 'srluul') {
	  if(message.includes('@srluul') && dungeonRegex.test(message)) {
		  let timedRemindList = await db.query(`SELECT * FROM luulbot_remindtimed`);
		  let dungeonNumberDB = await db.query(`SELECT value FROM luulbot_info WHERE setting = 'dungeon_num'`);
		  let dungeonNumber = Number(dungeonNumberDB.rows[0].value);
		  let format = `${dungeonNumber}/4 dungeons até upar peepoNerd`;
		  
		  if(parseInt(message.match(dungeonRegex))) {
		      format = `${dungeonNumber + 1}/4 dungeons até upar peepoNerd`;
		      await db.query(`UPDATE luulbot_info SET value = value + 1 WHERE setting = 'dungeon_num'`);
		  }
		  
		  if(dungeonNumber >= 4 || message.includes('⬆')) {
		      format = `upado com sucesso peepoNerd Clap`;
		      await db.query(`UPDATE luulbot_info SET value = 0 WHERE setting = 'dungeon_num'`);
		  }
		  
		  
		  let suggestID = timedRemindList.rows.sort((a,b) => b.id - a.id)[0].id + 1
		  client.say(channel, `peepoNerd glizzyL srluul irei avisá-lo sobre a dungeon em 3 horas | ${format}`)
		  await db.query(`INSERT INTO luulbot_remindtimed(userchannel, usersender, channelsender, message, time, timeparsed, id) VALUES($1,$2,$3,$4,$5,$6,$7)`, ['srluul', 'srluul', '#srluul', 'entre na dungeon peepoNerd glizzyL', Date.now() + 10800000, 10800000, suggestID || 1])
	  }
  }
  
  
	
	
  if(afkCheck.rows[0]) {
     
    let resumeAFKs = ['rafk', 'resumeafk'];
    let afkSearch = client.afkList.findIndex(i => i.username === user.username);
	  
	  
    if(resumeAFKs.includes(command)) return;	  
	  
    let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command));
    let {username, reason, afk, time, afktype, afkmessage} = afkCheck.rows[0];
    
	  
    if(cmdfile) {
     let cmdAliases = cmdfile.config.aliases;
     if(cmdAliases.includes(afk)) return;    
    }
	  
    if(afkSearch === -1) {
        client.afkList.push({username: user.username, reason: reason, afk: afk, time: time, channel: channel, afkType: afktype, afkMessage: afkmessage});
	setTimeout(() => client.afkList.splice(afkSearch, 1), 300000);
    }	  
    
    
    let passedTime = await ms(Date.now() - time , {secondsDecimalDigits: 0, unitCount: 2});
   
    
    
    await db.query(`DELETE FROM luulbot_afk WHERE username = '${user.username}'`);
	  
	 
	
	let aprilJoke;
	
	
	aprilJoke = `${username} ${afktype} ${reason} (${passedTime})`
        .split('')
        .map((i,f) => !parseInt(i, 0) && Math.floor(Math.random() * 10) >= 7 ? `${i}${i}`.toUpperCase() : i.toLowerCase())
        .join('');
	
	if(Math.random() * 50 < 1) {
	
	 const randomLanguage = ['de', 'es', 'el', 'zh', 'pl', 'ar'].sort(() => 0.5 - Math.random())[0];
	 aprilJoke = await translate(`${username} ${afktype} ${reason} (${passedTime})`, {src_lang: 'auto', tar_lang: randomLanguage}); 
	 
	}
	
	
	  
    await client.say(channel, aprilJoke);
    
  }
	
  if(remindCheck.rows[0]) {

   let messages = remindCheck.rows.filter(({usersender}) => usersender === user.username);
   let limit;

   switch(messages.length) {
	   case 1:
		   break;
	   case 2:
		   limit = 250;
		   break;
	   case 3:
		   limit = 150;
		   break;   
   }
	  
   messages = messages.map(i => `${(i.userchannel === user.username) ? 'você mesmo' : i.userchannel}: ${i.message.slice(0, limit)} (${ms(Date.now() - i.time , {secondsDecimalDigits: 0, unitCount: 2})})`).join(' / ');  
   await db.query(`DELETE FROM luulbot_remind WHERE usersender = '${user.username}'`);
	  
	
	
	let aprilJoke;
	
	
	aprilJoke = `${user.username}, lembrete de ${messages}`
        .split('')
        .map((i,f) => !parseInt(i, 0) && Math.floor(Math.random() * 10) >= 7 ? `${i}${i}`.toUpperCase() : i.toLowerCase())
        .join('');
	
	if(Math.random() * 50 < 1) {
	
	 const randomLanguage = ['de', 'es', 'el', 'zh', 'pl', 'ar'].sort(() => 0.5 - Math.random())[0];
	 aprilJoke = await translate(`${user.username}, lembrete de ${messages}`, {src_lang: 'auto', tar_lang: randomLanguage}); 
	 
	}
	
	
	  
   await client.say(channel, aprilJoke);	  
	  
  }
  
});


client.getEmotes = async (channel) => {
  
const emotes = [];
   
 try {
 
const ffzEmotes = await (await fetch(`https://decapi.me/ffz/emotes/${channel}`)).text()
const bttvEmotes = await (await fetch(`https://decapi.me/bttv/emotes/${channel}`)).text()
const twitchEmotes = await (await fetch(`https://decapi.me/twitch/subscriber_emotes/${channel}`)).text()

emotes.push({ ffz: ffzEmotes, bttv: bttvEmotes, twitch: twitchEmotes })
  
return emotes[0]; 
  
 } catch (err) {
  return 'Function Err!'
 }
  
}

client.getChannel = async (channel) => {
 
 try {
 
 let channelDB = await db.query(`SELECT * FROM luulbot_channels WHERE userchannel = '${channel}'`);
 
 let channelInfo = channelDB.rows[0]

 return channelInfo
 
 } catch(err) {
  return 'Function Err!'
 }
 
}
 

