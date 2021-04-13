module.exports.run = async ({args, user}) => {
  
  const db = require('./clients/database').db;
  const fetch = require('node-fetch');
  
  if(!args[0]) {
   return { reply: 'mande uma sugestão para alguém :/' } 
  }
  
  if(!args[1]) {
   return { reply: 'digite uma mensagem para este usuário :/' } 
  }
  
  
  let targetUser = args[1].toLowerCase();
  
  if(targetUser === 'me') {
   targetUser = user.username 
  }
  
  if(targetUser === 'luulbot') {
   return { reply: 'estou sempre aqui O_o' } 
  }
  
  const userFetch = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/user/${targetUser}`)).json();
  
  if(userFetch.error) {
   return { reply: 'usuário não existe :/' } 
  }
  
  let reason = args.join(' ');
  let currentTime = Date.now();
  let remindList = await db.query(`SELECT * FROM luulbot_remind WHERE usersender = '${targetUser}'`);
  
  if(remindList.rows.length >= 3) {
   return { reply: 'este usuário já possui muitos lembretes :/' } 
  }
  
  await db.query(`INSERT INTO luulbot_remind(userchannel, usersender, message, time) VALUES($1,$2,$3,$4)`, [user.username, targetUser, reason, currentTime]);
  
  targetUser = targetUser  === user.username ? 'você' : targetUser;
  
  return {
   reply: `${targetUser} será lembrado na próxima vez que digitar :)` 
  }
  
}

module.exports.config = {
 name: 'reminder',
 aliases: ['remind', 'lembrar'],
 description: 'Manda um lembrete para um usuário',
 usage: 'remind [user]',
 cooldown: 5000,
 level: 'Todos' 
}
