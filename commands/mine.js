module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");

const res = await (await fetch("https://api.mcsrvstat.us/2/0.tcp.sa.ngrok.io:13104")).json();
const {port, online, version, hostname} = res;
let playersOnline = res.players.online; let playersMax = res.players.max;
let format = `Servidor online! Players: ${playersOnline}/${playersMax} | Versão: ${version} | Ip: ${hostname}:${port}`;


if (online === false) return client.say(channel, `${username}, servidor offline FeelsBadMan`)
else { client.say(channel, `${username}, ${format}`)}

}

module.exports.config = {
name: "mine",
aliases: ["mn"],
description: "Informações sobre o servidor de mine de ghiletofar",
usage: "mine"
}
