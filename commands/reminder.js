module.exports.run = async ({args, user, channel, response}) => {
  
  const db = require('../clients/database.js').db;
  const fetch = require('node-fetch');
  const durationParser = require('parse-duration');
  const ms = require('pretty-ms');

  if(!args[0]) {
   return { reply: 'mande uma sugestão para alguém :/' } 
  }
  
  if(!args[1]) {
   return { reply: 'digite uma mensagem para este usuário :/' } 
  }
  
  
  let targetUser = args[0].toLowerCase();
  
  if(targetUser === 'me' || response === 'remindme') {
   targetUser = user.username 
  }
  
  if(targetUser === 'luulbot') {
   return { reply: 'estou sempre aqui O_o' } 
  }
  
  const userFetch = await db.query(`SELECT * FROM luulbot_users WHERE userchannel = $1`, [targetUser])
  
  if(!userFetch.rowCount) {
   return { reply: 'usuário nunca executou um comando :/' } 
  }
  
 

  let reasonLimit = (args[0] === 'me') ? 2 : targetUser.length
  
  let reason = (response === 'remindme') ? args.join(' ').trim() : args.join(' ').trim().slice(reasonLimit);
  let currentTime = Date.now();

  let timed = args.join(' ').substr(args.join(' ').toLowerCase().lastIndexOf(' in ') + 4);
  let timeCheck = parseFloat(timed);


  let remindList = await db.query(`SELECT * FROM luulbot_remind WHERE usersender = '${targetUser}'`);
  let channelRemindList = await db.query(`SELECT * FROM luulbot_remind WHERE userchannel = '${user.username}'`);
  let timedRemindList = await db.query(`SELECT * FROM luulbot_remindtimed`);
  let userTimedRemindList = await db.query(`SELECT * FROM luulbot_remindtimed WHERE usersender = '${targetUser}'`);
  
  if(remindList.rows.length >= 3) {
   return { reply: 'este usuário já possui muitos lembretes :/' } 
  }
  
  
  if(userTimedRemindList.rows.filter(i => new Date(i).getDate() === new Date().getDate()).length >= 5) {
   return { reply: 'Já existem muitos lembretes cronometrados neste dia :/' } 
  }
  
  if(!isNaN(timeCheck)) {
    if(isNaN(timeCheck)) return { reply: 'tempo inválido! Use "in" depois da mensagem' };
    
    let duration = durationParser(timed)
    if(timeCheck && duration < 60000) return { reply: 'o mínimo para lembretes é de 1 minuto' };
    if(timeCheck && duration > 31536000999) return { reply: 'lembrete ultrapassa o limite de tempo' };
    

    const formatedDuration = ms(duration, {secondsDecimalDigits: 0});
    reason = reason.replace(" in " + timed, "").replace("in " + timed, "").replace(timed, "").replace(" in ", "");
    reason = (!reason.length) ? '(sem mensagem)' : reason;
    
    let suggestID = timedRemindList.rowCount ? timedRemindList.rows.sort((a,b) => b.id - a.id)[0].id + 1 : 1;

    await db.query(`INSERT INTO luulbot_remindtimed(userchannel, usersender, channelsender, message, time, timeparsed, id) VALUES($1,$2,$3,$4,$5,$6,$7)`, [user.username, targetUser, channel, reason, currentTime + duration, duration, suggestID || 1]);
 
    targetUser = targetUser  === user.username ? 'você' : targetUser;

    return {
      reply: `lembrete será enviado para ${targetUser}, em ${formatedDuration} :)` 
     }
  }

  await db.query(`INSERT INTO luulbot_remind(userchannel, usersender, message, time) VALUES($1,$2,$3,$4)`, [user.username, targetUser, reason, currentTime]);
  
  targetUser = targetUser  === user.username ? 'você' : targetUser;
  
  return {
   reply: `lembrete enviado para ${targetUser} :)` 
  }
  
}

module.exports.config = {
 name: 'reminder',
 aliases: ['remind', 'lembrar', 'remindme'],
 description: 'Manda um lembrete para um usuário',
 usage: 'remind [user]',
 cooldown: 5000,
 level: 'Todos' 
}
