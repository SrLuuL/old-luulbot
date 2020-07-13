module.exports.run = async (client, message, args ,username, channel) => {

const fetch = require("node-fetch")

let user;
user = (!args[0]) ? user = channel : user = args[0];

let res = await fetch(`https://tmi.twitch.tv/group/user/${user}/chatters`)
let data = await res.json();

if (data === "") return client.say(channel, `${username}, usuário não foi encontrado :/`)

const {chatter_count} = data;
let vips = Object.keys(data.chatters.vips).length;
let mods = Object.keys(data.chatters.moderators).length;
let staffs = Object.keys(data.chatters.staff).length;

client.say(channel, `${username}, ${user} possui ${chatter_count} chatters(${vips} Vips/${mods} Mods/${staffs} staffs) presentes neste momento`)

}

module.exports.config = {
name: "chatters",
aliases: ["chatinfo"],
description: "Pega as informações de um determinado chat",
usage: "chatters [user]"
}
