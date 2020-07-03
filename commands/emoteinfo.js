module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch")

let res = await fetch(`https://api.ivr.fi/twitch/emotes/${args[0]}`);
let data = await res.json();

let user = data.channel
let id = data.channelid
let emote = data.emotecode
let tier = data.tier
let url = data.emoteurl_3x

if (data.status === 404) {
  return client.say(channel, `${username}, não encontrei esse emote`)
}

if (!args[0]) {
return client.say(channel, `${username}, insira um emote :/`)
} else {
client.say(channel, `${username}, Emote: ${emote} | ID: ${id} | Canal: ${user} | Tier: ${tier} | ${url}`)
}

}

module.exports.config = {
name: "emoteinfo",
aliases: ["ei"],
description: "Mostra informações de um emote de inscrito",
usage: "emoteinfo [emote]"
}

