module.exports.run = async (client, message, args, username, channel) => {
const channelsOptions = require("../credentials/login.js").channelOptions
const db = require("../clients/database.js").db

if (username !== "srluul") return;
if (!args[0]) return client.say(channel, `${username}, nenhum canal no input :Z`)
  

db.query(`INSERT INTO luulbot_channels(userchannel) VALUES('${args[0]}')`);
client.join(args[0]);
channelsOptions.push(`${args[0]}`)
client.say(channel, `${username}, entrei no canal ${args[0]} com sucesso!`)
}

module.exports.config = {
name: "join",
aliases: ["join"],
description: "Conecta o bot em um canal(uso privado)",
usage: "join [user]"
}
