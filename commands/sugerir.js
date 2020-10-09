module.exports.run = async (client, message, args, username, channel) => {

  const db = require("../clients/database.js").db
  
  const total = await db.query(`SELECT suggestid FROM luulbot_suggests ORDER BY suggestid ASC `);
  
  let suggestTotal = total.rows.pop();
  
  if (suggestTotal === undefined) {
    await (suggestTotal = 1)
  } else {
    await (suggestTotal = suggestTotal.suggestid + 1)
  }
  
  if (!args[0]) return client.say(channel, `${username}, insira uma sugestão :/`)
  
  await db.query(`INSERT INTO luulbot_suggests(userchannel, usersuggest, suggestid, priority, suggestdate) VALUES($1, $2, $3, $4, $5)`, [channel, args.join(' '), suggestTotal, 10, new Date(Date.now())])
  client.say(channel, `${username}, sugestão anotada :D 📝 (ID: ${suggestTotal})`)

}

module.exports.config = {
name: "sugerir",
aliases: ["suggest"],
description: "Sugere uma nova função para o bot",
usage: "sugerir [sugestão]"
}
