module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");

const ip = "kekwdance.pvp.host";
const res = await (await fetch(`https://api.mcsrvstat.us/2/${ip}`)).json();
const serverOnline = res.online;
if (serverOnline === false) return client.say(channel, `${username}, servidor offline FeelsBadMan`);
const {online, max} = res.players;
const format = `Servidor Online! Ip: ${ip} | Players: ${online}/${max} | Mods: https://bit.ly/3fMCWzv`

client.say(channel, `${username}, ${format}`);

}

module.exports.config = {
name: "mine",
aliases: ["mn","sv"],
description: "Informações sobre o servidor de mine",
usage: "mine"
}
