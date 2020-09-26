const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');


 client.getEmotes = async (channel) => {
  
const emotes = [];
   
const ffzEmotes = await (await fetch(`https://decapi.me/ffz/emotes/${channel}`)).text()
const bttvEmotes = await (await fetch(`https://decapi.me/bttv/emotes/${channel}`)).text()
const twitchEmotes = await (await fetch(`https://decapi.me/twitch/subscriber_emotes/${channel}`)).text()

emotes.push({ ffz: ffzEmotes, bttv: bttvEmotes, twitch: twitchEmotes })
  
return emotes[0];  
  
}


