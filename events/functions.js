const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');
const db = require('../clients/database.js').db;
const channels = require('../credentials/login.js').channelOptions;

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
 

