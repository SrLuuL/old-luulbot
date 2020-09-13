module.exports.run = async (client, message, args, username, channel) => {

  const db = require("../clients/database.js").db
  
  const total = await db.query(`SELECT suggestid FROM luulbot_suggests ORDER BY suggestid ASC `);
  const suggestTotal = await (total.rows.pop().suggestid || 1);
  
  if (!args[0]) return client.say(channel, `${username}, insira uma sugestão :/`)
  
  await db.query(`INSERT INTO luulbot_suggests(userchannel, usersuggest, suggestid) VALUES('${username}','${args.join(" ")}', '${suggestTotal + 1}')`)
  client.say(channel, `${username}, sugestão anotada :D 📝 (ID:${suggestTotal})`)

}

module.exports.config = {
name: "sugerir",
aliases: ["suggest"],
description: "Sugere uma nova função para o bot",
usage: "sugerir [sugestão]"
}
