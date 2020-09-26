const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');


 client.getEmotes = async (channel) => {
  
const emotes = [];
   
const urls = {
  ffz: `https://decapi.me/ffz/emotes/${channel}`,
  bttv: `https://decapi.me/bttv/emotes/${channel}`,
  twitch: `https://decapi.me/twitch/subscriber_emotes/${channel}`
};
  
  for(const index in urls) {
    const res = await (await fetch(urls[index])).text()
    emotes.push({ [index]: res })
  }
  
  return ...emotes;
  
}


