module.exports.run = async (context) => {

const db = require('../clients/database.js').db;
const {args, user} = context;
 
const sender = (args[0]) ? args[0] : user.username;
const triviaDB = await db.query(`SELECT * FROM luulbot_trivia WHERE user_name = '${sender}'`);

if(sender === 'top') {
 return { reply: 'Leaderboard em construção 🔧 ' }
}
 
if (!triviaDB.rowCount) {
 return { reply: 'Você não acertou nenhuma trivia :/' }
} else {
 return { reply: `você já acertou ${triviaDB.rows[0].user_points} trivia(s)! [${triviaDB.rows.findIndex(i => i['user_name'] === sender) + 1}° Lugar]` }
 }

}

module.exports.config = {
name: 'triviarank',
aliases: ['tr'],
description: 'Mostra os pontos de trivia do top ou de uma pessoa',
usage: 'triviarank [user/top]',
cooldown: 4000,
level: 'Todos'
}
