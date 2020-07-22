module.exports.run = async (client, message, args, username, channel) => {
const channelsOptions = require("../credentials/login.js").channelsOptions
const db = require("../clients/database.js").db

if (username !== "srluul") return;
if (!args[0]) return client.say(channel, `${username}, nenhum canal no input :Z`)



db.query(`DELETE FROM luulbot_channels WHERE userchannel='${args[0]}' `, (err) => {if (err) throw err});
client.part(args[0]);
channelsOptions.pop(`'${args[0]}'`)
client.say(channel, `${username}, saí de ${args[0]} com sucesso!`);


}

module.exports.config = {
name: "part",
aliases: ["part"],
description: "Conecta o bot em um canal",
usage: "join [user]"
}
