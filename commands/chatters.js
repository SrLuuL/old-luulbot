module.exports.run = async (client, message, args ,username, channel) => {

const fetch = require("node-fetch")

let user = (!args[0]) ?  channel.slice(1) :  args[0].toLowerCase();

const res = await (await fetch(`https://tmi.twitch.tv/group/user/${user}/chatters`)).json();  
const {chatter_count} = res;  

if (!chatter_count) return client.say(channel, `${username}, usuário não possui chatters :/`)

const {chatters: {vips, moderators, staff}} = res;
  
let modsTotal = (moderators.length > 1) ? `${moderators.length} mods` : `1 mod`;
let vipsTotal = (vips.length > 1) ? `${vips.length} vips` : `1 vip`;
let staffsTotal = (staff.length > 1) ? `${staff.length} staffs` : `1 staff`;  
  
const verifier = [(vips.length > 0 ? vipsTotal : 0), (moderators.length > 0 ? modsTotal : 0), (staff.length > 0 ? staffsTotal : 0)];
let fullFormat = verifier.filter(Boolean)
  
if (!fullFormat.find(index => index)) {
  fullFormat = ''
} else {
  fullFormat = `(${fullFormat.join('/')})`
}
  
  
user = (user === username) ? "você" : user;  

  
client.say(channel, `${username}, ${user} possui ${chatter_count} chatters ${fullFormat} presentes neste momento`)

}

module.exports.config = {
name: "chatters",
aliases: ["chatinfo"],
description: "Pega as informações de um determinado chat",
usage: "chatters [user]",
level: 'Todos',
cooldown: 5000
}
