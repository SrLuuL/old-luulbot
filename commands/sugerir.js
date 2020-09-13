module.exports.run = async (client, message, args, username, channel) => {

  const db = require("../clients/database.js").db
  
  const total = await db.query(`SELECT suggestid FROM luulbot_suggests ORDER BY suggestid ASC `);
  let suggestTotal = (typeof total.rows.pop() === undefined) ? await 1 : await +1;
  
  if (!args[0]) return client.say(channel, `${username}, insira uma sugestão :/`)
  
  await db.query(`INSERT INTO luulbot_suggests(userchannel, usersuggest, suggestid) VALUES('${username}','${args.join(" ")}', '${suggestTotal}')`)
  client.say(channel, `${username}, sugestão anotada :D 📝 (ID:${suggestTotal})`)

}

module.exports.config = {
name: "sugerir",
aliases: ["suggest"],
description: "Sugere uma nova função para o bot",
usage: "sugerir [sugestão]"
}
