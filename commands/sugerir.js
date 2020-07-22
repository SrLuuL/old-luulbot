module.exports.run = (client, message, args, username, channel) => {

  const db = require("../clients/database.js").db
  
  let total = await db.query(`SELECT userchannel FROM luulbot_suggests`)
  
   if (!args[0]) return client.say(channel, `${username}, insira uma sugestão :/`)
  
  await db.query(`INSERT INTO luulbot_suggests(userchannel, usersuggest, suggestid) VALUES('${username}','${args.join(" ")}', '${total.rows.length + 1}')`)
  client.say(channel, `${username}, sugestão anotada :D 📝 (ID:${total.rows.length})`)

}

module.exports.config = {
name: "sugerir",
aliases: ["suggest"],
description: "Sugere uma nova função para o bot",
usage: "sugerir [sugestão]"
}
