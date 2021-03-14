module.exports.run = async ({args, response, user}) => {
  
  const db = require('../clients/database.js').db;
  
  let afkMessage = `${user.username} está AFK:`;
  let currentDate = Date.now();
  let message = (!args[0]) ? '(sem mensagem)' : args.join(' ');
  
  switch(response) {
    case 'gn':
      afkMessage = `${user.username} foi dormir:`
      message += ' 💤';
      break;
    case 'study':
      afkMessage = `${user.username} foi estudar:`
      message += ' 📚';
    case 'shower':
      afkMessage = `${user.username} foi tomar banho:`
      message += ' 🚿';
  }
  
  await db.query(`INSERT INTO luulbot_afk(channel, reason, afk, time) VALUES($1, $2, $3, $4)`, [user.username, message, response, currentDate])
  
}

module.exports.config = {
 name: 'afk',
 aliases: ['gn', 'study', 'shower']
}

