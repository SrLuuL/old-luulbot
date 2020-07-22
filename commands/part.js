module.exports.run = async (client, message, args, username, channel) => {
const channelsOptions = require("../credentials/login.js").channelsOptions
const db = require("../clients/database.js").db

if (username !== "srluul") return;
if (!args[0]) return client.say(channel, `${username}, nenhum canal no input :Z`)
if (!channelsOptions.includes(args[0]) return client.say(channel, `${username}, não estou nesse canal :/`)


db.query(`DELETE FROM luulbot_channels WHERE userchannel='${args[0]}' `, (err) => {if (err) throw err});
let index = channelsOptions.indexOf(args[0])
channelsOptions.splice(index, 1)  
client.part(args[0]);
channelsOptions.delete(`${args[0]}`)
client.say(channel, `${username}, saí de ${args[0]} com sucesso!`);


}

module.exports.config = {
name: "part",
aliases: ["part"],
description: "Conecta o bot em um canal",
usage: "join [user]"
}
