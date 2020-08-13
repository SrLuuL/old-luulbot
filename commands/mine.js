module.exports.run = async (client, message, args, username, channel) => {


  
const fetch = require("node-fetch");

const ip = "kekwdance.pvp.host";
const res = await (await fetch(`https://api.minetools.eu/ping/${ip}/25576`)).json();
if (res.error) return client.say(channel, `${username}, servidor offline FeelsBadMan`);
const {online, max} = res.players;
const {name} = res.version;
const format = `Servidor Online! Ip: ${ip} | Players: ${online}/${max} | Mods: https://bit.ly/3fMCWzv | Versão: ${name}`

client.say(channel, `${username}, ${format}`);

}

module.exports.config = {
name: "mine",
aliases: ["mn","sv"],
description: "Informações sobre o servidor de mine",
usage: "mine"
}
