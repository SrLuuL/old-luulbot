module.exports.run = async (context) => {

  const db = require("../clients/database.js").db
  const moment = require('moment');
  const sani  = require('sanitizer')

  const total = await db.query(`SELECT suggestid FROM luulbot_suggests ORDER BY suggestid ASC `);
  
  let suggestTotal = total.rows.pop();
  
  if (suggestTotal === undefined) {
    await (suggestTotal = 1)
  } else {
    await (suggestTotal = suggestTotal.suggestid + 1)
  }
  
  if (!context.args[0]) return { reply: 'mande uma sugestão :/' }
  
 const currentDate = moment().locale('pt');
 const filterSuggest  = await sani.escape(context.args.join(' '));

  await db.query(`INSERT INTO luulbot_suggests(userchannel, usersuggest, userid, suggestid, priority, suggestdate) VALUES($1, $2, $3, $4, $5, $6)`, [context.user.username, filterSuggest, context.user['user-id'], suggestTotal, 10, new Date(currentDate)])

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
