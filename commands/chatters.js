module.exports.run = async (client, message, args ,username, channel) => {

const fetch = require("node-fetch")

let user;
user = (!args[0]) ? user = channel.slice(1) : user = args[0];

const res = await (await fetch(`https://tmi.twitch.tv/group/user/${user}/chatters`)).json();  
  

if (!res.chatter_count) return client.say(channel, `${username}, usuário não possui chatters :/`)

const {chatter_count} = res;

const getRoles = ({vips, mods, staffs}) => {
  const v = (vips.length >= 0) ? `${vips.length} vips` : 0
  const m = (mods.length >= 0) ? `${mods.length} mods` : 0
  const s = (staffs.length >= 0) ? `${staffs.length} staffs` : 0
  
  if (![v,m,s].find(i => i)) return ''
  
  return `${[v,m,s].filter(Boolean).join('/')}`
} 
  
user = (user === username) ? "Você" : user;  

  
client.say(channel, `${username}, ${user} possui ${chatter_count} chatters ${getRoles(res.chatters)} presentes neste momento`)

}

module.exports.config = {
name: "chatters",
aliases: ["chatinfo"],
description: "Pega as informações de um determinado chat",
usage: "chatters [user]"
}
