module.exports.run = async (client, message, args ,username, channel) => {

const fetch = require("node-fetch")

let user = (!args[0]) ?  channel.slice(1) :  args[0].toLowerCase();

const res = await (await fetch(`https://tmi.twitch.tv/group/user/${user}/chatters`)).json();  
const {chatter_count} = res;  

if (!chatter_count) return client.say(channel, `${username}, usuário não possui chatters :/`)

const {chatters: {vips, moderators, staff}} = res;
  
const verifier = [(vips.length > 0 ? vips.length + ' vips' : 0), (moderators.length > 0 ? moderators.length + ' mods' : 0), (staff.length > 0 ? staff.length + ' staffs' : 0)];
let fullFormat = verifier.filter(Boolean)
  
if (!fullFormat.find(index => index)) {
  fullFormat = ''
} else {
  fullFormat = `(${fullFormat.join('/')})`
}
  
  
user = (user === username) ? "Você" : user;  

  
client.say(channel, `${username}, ${user} possui ${chatter_count} chatters ${fullFormat} presentes neste momento`)

}

module.exports.config = {
name: "chatters",
aliases: ["chatinfo"],
description: "Pega as informações de um determinado chat",
usage: "chatters [user]"
}
