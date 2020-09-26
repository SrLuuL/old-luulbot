const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');

client.getEmotes =  (channel) => {
  
const emotes = [];
const urls = {
  ffzEmotes: `https://decapi.me/ffz/emotes/${channel}`,
  bttvEmotes: `https://decapi.me/bttv/emotes/${channel}`,
  twitchEmotes: `https://decapi.me/twitch/subscriber_emotes/${channel}`
}
  
(async () => {
  
  for(const index in urls) {
    
    const res = await (await fetch(urls[index])).text()
    emotes.push({ [index]: res })
}
  return emotes
})()

  
}
