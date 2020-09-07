const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');

await client.getEmotes = async (channel) => {
const emotes = [];  
const resFFZ = await (await fetch(`https://decapi.me/ffz/emotes/${channel}`)).text();
const resBTTV = await (await fetch(`https://decapi.me/bttv/emotes/${channel}`)).text();
const resTwitch = await (await fetch(`https://decapi.me/twitch/subscriber_emotes/${channel}`)).text();  
  
emotes.push({ffz: resFFZ, bttv: resBTTV, twitch: resTwitch})  
return emotes
}
