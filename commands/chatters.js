module.exports.run = async (client, message, args ,username, channel) => {

const fetch = require("node-fetch")

let user;
user = (!args[0]) ? user = channel.slice(1) : user = args[0];

let res = await fetch(`https://tmi.twitch.tv/group/user/${user}/chatters`)
let data = await res.json();

if (data === "") return client.say(channel, `${username}, usuário não foi encontrado :/`)

const {chatter_count} = data;
let vips = Object.keys(data.chatters.vips).length;
vips = (vips > 0) ? vips + " vips" : null
let mods = Object.keys(data.chatters.moderators).length;
mods = (mods > 0) ? mods + " mods" : null  
let staffs = Object.keys(data.chatters.staff).length;
staffs = (staffs > 0) ? staffs + " staffs" : null  

let roles = [vips, mods, staffs].filter(Boolean).join("/")  
  
client.say(channel, `${username}, ${user} possui ${chatter_count} chatters(${roles}) presentes neste momento`)

}

module.exports.config = {
name: "chatters",
aliases: ["chatinfo"],
description: "Pega as informações de um determinado chat",
usage: "chatters [user]"
}
