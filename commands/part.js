module.exports.run = async (client, message, args, username, channel) => {

const db = require("../clients/database.js").db

if (username !== "srluul") return;
if (!args[0]) return client.say(channel, `${username}, nenhum canal no input :Z`)


try{
db.query(`DELETE FROM luulbot_channels WHERE userchannel='${args[0]}' `);
client.join(args[0]);
client.say(channel, `${username}, saí de ${args[0]} com sucesso!`);
} catch (err) {client.say(channel, `${username}, não possuo este canal em minha database :/`)}

}

module.exports.config = {
aliases: ["part"],
description: "Conecta o bot em um canal",
usage: "join [user]"
}
