module.exports.run = async (context) => {

const db = require('../clients/database.js').db;
const {args, user} = context;
 
let sender = (args[0]) ? args[0].toLowerCase() : user.username.toLowerCase();
const triviaDB = await db.query(`SELECT * FROM luulbot_trivia WHERE user_name = '${sender}'`);
const triviaTopDB =  await db.query(`SELECT * FROM luulbot_trivia ORDER BY user_points DESC`);
 
if(sender === 'top') {
 return { reply: 'Leaderboard em construção 🔧 ' }
}

sender = (sender === user.username) ? 'você' : sender; 
 
if (!triviaDB.rowCount) {
 return { reply: `${sender} não acertou nenhuma trivia`}
} else {
 return { reply: `${sender} já acertou ${triviaDB.rows[0].user_points} trivia(s)! [${(triviaTopDB.rows.findIndex(i => i['user_name'] === sender) + 1)}° Lugar]` }
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
