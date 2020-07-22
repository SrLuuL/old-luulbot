module.exports.run = async (client, message, args, username, channel) => {

const db = require("../clients/database.js").db

if (!args[0]) return client.say(channel, `${username}, nenhum canal no input :Z`)

db.query(`INSERT INTO luulbot_channels(userchannel) VALUES('${args[0]}')`);
client.join(args[0]);

}

module.exports.config = {
description: "Conecta o bot em um canal",
usage: "join [user]"
}
