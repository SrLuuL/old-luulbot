module.exports.run = async (context) => {

  const db = require("../clients/database.js").db
  
  const total = await db.query(`SELECT suggestid FROM luulbot_suggests ORDER BY suggestid ASC `);
  
  let suggestTotal = total.rows.pop();
  
  if (suggestTotal === undefined) {
    await (suggestTotal = 1)
  } else {
    await (suggestTotal = suggestTotal.suggestid + 1)
  }
  
  if (!context.args[0]) return { reply: 'mande uma sugestão :/' }
  
const currentDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute:'2-digit',
    second:'2-digit'
})
  
  await db.query(`INSERT INTO luulbot_suggests(userchannel, usersuggest, userid, suggestid, priority, suggestdate) VALUES($1, $2, $3, $4, $5, $6)`, [context.user.username, context.args.join(' '), context.user['user-id'], suggestTotal, 10, currentDate])

  return {
   reply: `sugestão anotada :D 📝 (ID: ${suggestTotal})` 
  }

}

module.exports.config = {
name: "sugerir",
aliases: ["suggest"],
description: "Sugere uma nova função para o bot",
usage: "sugerir [sugestão]",
level: 'Todos',
cooldown: 4000    
}
