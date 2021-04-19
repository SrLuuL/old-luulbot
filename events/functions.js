const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');
const db = require('../clients/database.js').db;
const channels = require('../credentials/login.js').channelOptions;
const ms = require('pretty-ms');
const luulbot = require ("../clients/discord.js").luulbot;

client.afkList = [];

async function timedRemindCheck() {
	
  const remindTimeDB = await db.query('SELECT * FROM luulbot_remindtimed');

  let remindTimeCheck = remindTimeDB.rows.find(i => i.time - Date.now() <= 0);

  if(remindTimeCheck) {
    let {userchannel, usersender, channelsender, message, time} = remindTimeCheck;
	     console.log(userchannel, usersender, channelsender, message, time);
    let formatedTime = ms(Date.now() - time, {colonNotation: true});

    client.say(channelsender, `lembrete cronometrado de ${usersender === userchannel ? 'você' : usersender}:  ${message} (${formatedTime})`);
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
    await client.say(channel, `${username} ${afktype} ${reason} (${passedTime})`);
    
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
   await client.say(channel, `${user.username}, lembrete de ${messages}`);	  
	  
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
 

