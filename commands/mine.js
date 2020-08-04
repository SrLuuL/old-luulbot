module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");
const haste = require("hastebin-gen");
  
const resSVInf = await (await fetch("https://mcapi.xdefcon.com/server/0.tcp.sa.ngrok.io:13104/full/json")).json();
const resSVP = await (await fetch("https://api.mcsrvstat.us/2/0.tcp.sa.ngrok.io:13104")).json();
const {serverStatus, serverip, version, players, maxplayers, ping} = resSVInf;
const {list} = resSVP.players;
const playersList = await haste(list);
let format = `Servidor online! Players: ${players}/${maxplayers} | Ip: ${serverip} | Versão: ${version} | Ping: ${ping} ms`;

  
  switch(args[0]) {
    case "players":
      if (serverStatus === "offline") return client.say(channel, `${username}, servidor offline FeelsBadMan`)
      else {
        return client.say(channel, `${username}, Jogadores ativos: ${playersList}`)
      }
  }
  
  
if (serverStatus === "offline") return client.say(channel, `${username}, servidor offline FeelsBadMan`)
else { 
  client.say(channel, `${username}, ${format}`)
}

}

module.exports.config = {
name: "mine",
aliases: ["mn"],
description: "Informações sobre o servidor de mine de ghiletofar",
usage: "mine"
}
