module.exports.run = async (client, message, args ,username, channel) => {

const fetch = require("node-fetch")

let user;
user = (!args[0]) ? user = channel.slice(1) : user = args[0];

const res = await (await fetch(`https://tmi.twitch.tv/group/user/${user}/chatters`)).json();  
  

if (!res.chatter_count) return client.say(channel, `${username}, usuário não possui chatters :/`)

const {chatter_count} = res;

const getRoles = ({vips, moderators, staff}) => {
  const v = (vips.length >= 0) ? `${vips.length} vips` : 0
  const m = (moderators.length >= 0) ? `${moderators.length} mods` : 0
  const s = (staff.length >= 0) ? `${staff.length} staffs` : 0
  
  if (![v,m,s].find(i => i)) return ''
  
  return `(${[v,m,s].filter(Boolean).join('/')})`
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
