module.exports.run = async ({args, channel, user: username}) => {

const fetch = require("node-fetch")

let user = (!args[0]) ?  channel.slice(1) :  args[0].toLowerCase();

const res = await (await fetch(`https://tmi.twitch.tv/group/user/${user}/chatters`)).json();  
const {chatter_count} = res;  

if (!chatter_count) {
 return { reply: 'usuário não possui chatters :/' } 
}

const {chatters: {vips, moderators, staff}} = res;
  
let modsTotal = (moderators.length > 1) ? `${moderators.length} Mods` : `1 Mod`;
let vipsTotal = (vips.length > 1) ? `${vips.length} Vips` : `1 Vip`;
let staffsTotal = (staff.length > 1) ? `${staff.length} Staffs` : `1 Staff`;  
  
const verifier = [(vips.length > 0 ? vipsTotal : 0), (moderators.length > 0 ? modsTotal : 0), (staff.length > 0 ? staffsTotal : 0)];
let fullFormat = verifier.filter(Boolean)
  
if (!fullFormat.find(index => index)) {
  fullFormat = ''
} else {
  fullFormat = `| ${fullFormat.join('/')}`
}
  
  
user = (user === username.username) ? "você" : user;  
let chatter  = (chatter_count === 1)  ? 'chatter presente' : 'chatters presentes'

return {
 reply: `${user} possui ${chatter_count} ${chatter} neste momento ${fullFormat}` 
}
  


}

module.exports.config = {
name: "chatters",
aliases: ["chatinfo"],
description: "Pega as informações de um determinado chat",
usage: "chatters [user]",
level: 'Todos',
cooldown: 5000
}
