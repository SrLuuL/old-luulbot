module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");

const res = await (await fetch("https://mcapi.xdefcon.com/server/0.tcp.sa.ngrok.io:13104/full/json")).json();
const {serverStatus, serverip, version, players, maxplayers, ping} = res;
let format = `Servidor online! Players: ${players}/${maxplayers} | Ip: ${serverip} | Versão: ${version} | Ping: ${ping} ms`;

if (serverStatus === "offline") return client.say(channel, `${username}, servidor offline FeelsBadMan`)
else { client.say(channel, `${username}, ${format}`)}

}

module.exports.config = {
name: "mine",
aliases: ["mn"],
description: "Informações sobre o servidor de mine de ghiletofar",
usage: "mine"
}
