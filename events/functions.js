const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');
const db = require('../clients/database.js').db;
const channels = require('../credentials/login.js').channelOptions;
const ms = require('pretty-ms')

client.on('message', async (channel, message, user) => {
  
  const afkCheck = await db.query(`SELECT * FROM luulbot_afk WHERE channel = '${channel}' AND username = '${user.username}'`);
  
  if(afkCheck.rowCount) {
     
    let afkMessage = `${user.username} saiu do AFK:`
    let {username, reason, afk, time, channel: userchannel} = afkCheck.rows[0];
    let passedTime = await ms(Date.now() - time , {secondsDecimalDigits: 0});
    
    switch(afk) {
     case 'gn':
        afkMessage = `${username} acordou:`
        break;
      case 'study':
        afkMessage = `${username} parou de estudar:`
        break;
      case 'shower':
        afkMessage = `${username} saiu do banho:`
    }
    
    await db.query(`DELETE FROM luulbot_afk WHERE channel = ${channel} AND username = ${user.username}`);
    await client.say(userchannel, `${afkMessage} ${reason} (${passedTime})`);
    
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
 

