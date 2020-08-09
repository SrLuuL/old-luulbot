module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");

const ip = "kekwdance.pvp.host";
const res = await (await fetch(`https://api.mcsrvstat.us/2/${ip}`)).json();
const {online, max} = res.players;
const serverOnline = res.online;
const format = `Servidor Online! Ip: ${ip} | Players: ${online}/${max} | Mods: https://bit.ly/3fMCWzv`

if (serverOnline === true) { client.say(channel, `${username}, ${format}`) } 
else { client.say(channel, `${username}, servidor offline FeelsBadMan`); }

}

module.exports.config = {
name: "mine",
aliases: ["mn","sv"],
description: "Informações sobre o servidor de mine",
usage: "mine"
}
