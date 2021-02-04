module.exports.run = async (context) => {

const db = require('../clients/database.js').db;
const {args, user} = context;
 
if(!args[0]) {
 return { reply: 'insira uma questão :/' }
 }
 
 await db.query('INSERT INTO luulbot_ts(username, userid, userquestion) VALUES ($1, $2, $3)', [user.username, user['user-id'], args.join(' ')])
 
 return {
 reply: 'questão anotada :D 📝'
 }

}

module.exports.config = {
name: 'triviasuggest',
aliases: ['ts'],
description: 'Sugere uma nova questão para o trivia ou reporta alguma mal formulada',
usage: 'triviasuggest [questão]',
cooldown: 5000,
level: 'Privado',
family: 'trivia'
}
