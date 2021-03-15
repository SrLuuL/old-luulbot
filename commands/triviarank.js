module.exports.run = async ({args, user}) => {

const db = require('../clients/database.js').db;

 try {
 
let sender = (args[0]) ? args[0].toLowerCase() : user.username.toLowerCase();
const triviaDB = await db.query(`SELECT * FROM luulbot_trivia WHERE user_name = '${sender}'`);
const triviaPlaceDB = await db.query(`SELECT ROW_NUMBER() OVER(ORDER BY user_points DESC) AS Rank, user_points FROM luulbot_trivia`);
const triviaTopDB =  await db.query(`SELECT * FROM luulbot_trivia ORDER BY user_points DESC LIMIT 5`);
 
const emojis = ['👑', '🥈', '🥉', '🎖️', '🎖️'] 
 
if(sender === 'top') {
 const leaderboard = triviaTopDB.rows.map((i,f) => `${emojis[f]} ${i['user_name']}(${i['user_points']})`);
 return { reply: `Top 5 trivia: ${leaderboard.join(' ')}`}
}

 
sender = (sender === user.username) ? 'você' : sender; 
 
if (!triviaDB.rowCount) {
 return { reply: `${sender} não acertou nenhuma trivia`}
} else {
 let triviaPoints = triviaDB.rows[0].user_points;
 let triviaPlace =  triviaPlaceDB.rows.find(i => i['user_points'] === triviaPoints).rank;
 return { reply: `${sender} já acertou ${triviaPoints} trivia(s)! [${triviaPlace}° Lugar]` }
 }

 } catch(e) {
  return { reply: `pessoa inválida :/` }
 }
  
}

module.exports.config = {
name: 'triviarank',
aliases: ['tr'],
description: 'Mostra os pontos de trivia do top ou de uma pessoa',
usage: 'triviarank [user/top]',
cooldown: 4000,
level: 'Privado',
family: 'trivia'
}
