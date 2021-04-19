module.exports.run = async ({args, user, channel}) => {
  
  const db = require('../clients/database.js').db;
  const fetch = require('node-fetch');
  const durationParser = require('duration-parser');
  const ms = require('pretty-ms');

  if(!args[0]) {
   return { reply: 'mande uma sugestão para alguém :/' } 
  }
  
  if(!args[1]) {
   return { reply: 'digite uma mensagem para este usuário :/' } 
  }
  
  
  let targetUser = args[0].toLowerCase();
  
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
  
 

  let reasonLimit = (args[0] === 'me') ? 2 : targetUser.length
  
  let reason = args.join(' ').trim().slice(reasonLimit);
  let currentTime = Date.now();

  let timed = args.join(' ').substr(args.join(' ').toLowerCase().lastIndexOf(' in ') + 4);
  let timeCheck = parseInt(timed, 0); 


  let remindList = await db.query(`SELECT * FROM luulbot_remind WHERE usersender = '${targetUser}'`);
  
  if(remindList.rows.length >= 3) {
   return { reply: 'este usuário já possui muitos lembretes :/' } 
  }
  
  if(timeCheck) {
    let duration = durationParser(timed)
    if(!parseFloat(timed) && timeCheck) return { reply: 'tempo inválido! Use "in" antes do tempo informado ' };
    if(timeCheck && duration < 60000) return { reply: 'o mínimo para lembretes é de 1 minuto' };
    if(timeCheck && duration > 31536000999) return { reply: 'lembrete ultrapassa o limite de tempo' };

    const formatedDuration = ms(duration, {colonNotation: true});
    reason.replace('in ' + timed, '').replace(' in ' + timed, '').replace(' in' + timed, '');


    await db.query(`INSERT INTO luulbot_remindtimed(userchannel, usersender, channelsender, message, time) VALUES($1,$2,$3,$4,$5)`, [user.username, targetUser, channel, reason, currentTime]);
 
    targetUser = targetUser  === user.username ? 'você' : targetUser;

    return {
      reply: `${targetUser} será lembrado disso em ${formatedDuration} :)` 
     }
  }

  await db.query(`INSERT INTO luulbot_remind(userchannel, usersender, message, time) VALUES($1,$2,$3,$4)`, [user.username, targetUser, reason, currentTime]);
  
  targetUser = targetUser  === user.username ? 'você' : targetUser;
  
  return {
   reply: `${targetUser} será lembrado disso :)` 
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
