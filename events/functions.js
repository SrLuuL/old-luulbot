const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');

client.getEmotes = async (channel) => {
const emotes = [];  
const resFFZ = await (await fetch(`https://decapi.me/ffz/emotes/${channel}`)).text();
return resFFZ
}
