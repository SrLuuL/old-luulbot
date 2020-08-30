module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");

const res = await (await fetch(`https://api.ivr.fi/twitch/emotes/${args[0]}`)).json();
  
const {channel:channelEmote, emoteid, emotecode, tier} = res;

let url = `https://twitchemotes.com/emotes/${emoteid}`  
  
if (res.status === 404 || res.status === 500) return client.say(channel, `${username}, não encontrei esse emote :/`);


if (!args[0]) {
client.say(channel, `${username}, insira um emote :/`)
} else {
client.say(channel, `${username}, Emote: ${emotecode} | ID: ${emoteid} | Canal: ${channelEmote} | Tier: ${tier} | ${url}`)
}

}

module.exports.config = {
name: "emoteinfo",
aliases: ["ei"],
description: "Mostra informações de um emote de inscrito",
usage: "emoteinfo [emote]"
}

