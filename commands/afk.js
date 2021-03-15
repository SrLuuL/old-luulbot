module.exports.run = async ({args, response, user, channel}) => {
  
  const db = require('../clients/database.js').db;
  
  let afkMessage = `${user.username} está AFK:`;
  let currentDate = Date.now();
  let message = (!args[0]) ? '(sem mensagem)' : args.join(' ');
  let afkStatus = await db.query(`SELECT * FROM luulbot_afk WHERE username = '${user.username}'`);
  
  if(afkStatus.rows[0]) {
   return { reply: `você já está em AFK!` } 
  }
  
  switch(response) {
    case 'gn':
      afkMessage = `${user.username} foi dormir:`
      message += ' 💤';
      break;
    case 'study':
      afkMessage = `${user.username} foi estudar:`
      message += ' 📚';
      break;
    case 'shower':
      afkMessage = `${user.username} foi tomar banho:`
      message += ' 🚿';
      break;
    case 'food':
      afkMessage = `${user.username} foi comer:`
      message += ' 🍴';
  }
  
  await db.query(`INSERT INTO luulbot_afk(username, reason, afk, time, channel) VALUES($1, $2, $3, $4, $5)`, [`${user.username}`, message, response, currentDate, channel])
  return { reply: `${afkMessage} ${message}`, mode: 'say'}
}

module.exports.config = {
 name: 'afk',
 aliases: ['gn', 'study', 'shower'],
 usage: 'afk',
 description: 'Seta um afk',
 cooldown: 4000,
 level: 'Todos'
}

