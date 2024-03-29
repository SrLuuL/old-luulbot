module.exports.run = async ({args, user}) => {

  const db = require("../clients/database.js").db
  const moment = require('moment-timezone');


  const total = await db.query(`SELECT suggestid FROM luulbot_suggests ORDER BY suggestid ASC `);
  
  let suggestTotal = total.rows.pop();
  
  if (suggestTotal === undefined) {
    await (suggestTotal = 1)
  } else {
    await (suggestTotal = suggestTotal.suggestid + 1)
  }
  
  if (!args[0]) return { reply: 'mande uma sugestão :/' }
  
 const currentDate = moment.tz(new Date(), 'America/Bahia').locale('pt').format('YYYY-MM-DDTHH:mm:ss');
 const fillteredSuggest = args.join(' ')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;');
 

  await db.query(`INSERT INTO luulbot_suggests(userchannel, usersuggest, userid, suggestid, priority, suggestdate) VALUES($1, $2, $3, $4, $5, $6)`, [user.username, fillteredSuggest, user['user-id'], suggestTotal, 10, new Date(currentDate)])

  return {
   reply: `sugestão anotada :D 📝 (ID: ${suggestTotal}) https://luulbot.herokuapp.com/suggests/${suggestTotal}` 
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
