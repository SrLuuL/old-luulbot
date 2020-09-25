module.exports.run = async (client, message, args ,username, channel) => {

const fetch = require("node-fetch")

let user = (!args[0]) ?  channel.slice(1) :  args[0].toLowerCase();

const res = await (await fetch(`https://tmi.twitch.tv/group/user/${user}/chatters`)).json();  
const {chatter_count} = res;  

if (!chatter_count) return client.say(channel, `${username}, usuário não possui chatters :/`)

const {chatters: {vips, moderators, staff}} = res;
  
const verifier = [(vips ? vips.length + ' vips' : 0), (moderators ? moderators.length + ' mods' : 0), (staff ? staff.length + ' staffs' : 0)];
const fullFormat = verifier.filter(Boolean).join('/');
  

  
user = (user === username) ? "Você" : user;  

  
client.say(channel, `${username}, ${user} possui ${chatter_count} chatters ${fullFormat} presentes neste momento`)

}

module.exports.config = {
name: "chatters",
aliases: ["chatinfo"],
description: "Pega as informações de um determinado chat",
usage: "chatters [user]"
}
