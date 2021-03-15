const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');
const db = require('../clients/database.js').db;
const channels = require('../credentials/login.js').channelOptions;
const ms = require('pretty-ms');
const luulbot = require ("../clients/discord.js").luulbot;

client.on('message', async (channel, user, message, self) => {
  
  let canal = channel.replace("#", ""); 	
  let prefixDB = await db.query(`SELECT prefix from luulbot_channels WHERE userchannel='${canal}'`);
  let prefix = prefixDB.rows[0].prefix
  
	
  let args = message.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift();
  if(self) return;

  const afkCheck = await db.query(`SELECT * FROM luulbot_afk WHERE username = '${user.username}'`);
  
  if(afkCheck.rows[0]) {
     
    let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command));
    let afkMessage = `${user.username} saiu do AFK:`
    let {username, reason, afk, time, afktype} = afkCheck.rows[0];
    
    if(cmdfile) {
     let cmdAliases = cmdfile.config.aliases;
     if(cmdAliases.includes(afk)) return;
    }
    
    
    let passedTime = await ms(Date.now() - time , {secondsDecimalDigits: 0});
   
    
    
    await db.query(`DELETE FROM luulbot_afk WHERE username = '${user.username}'`);
    await client.say(channel, `${username} ${afktype} ${reason} (${passedTime})`);
    
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
 

