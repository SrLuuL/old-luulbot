module.exports.run = async ({args, response, user, channel, client}) => {
  
  const db = require('../clients/database.js').db;
  
  if(user['message-type'] === 'whisper') {
    return { reply: 'comando não disponível em whispers!' }
  }
  
  let afkList = client.afkList;
  let afkMessage = `${user.username} está AFK:`;
  let currentDate = Date.now();
  let message = (!args[0]) ? '(sem mensagem)' : args.join(' ');
  let afkStatus = await db.query(`SELECT * FROM luulbot_afk WHERE username = '${user.username}'`);
  
  if(message.length > 300) {
   return { reply: `mensagem muito longa :/` } 
  }
  
  if(afkStatus.rows[0]) {
   return { reply: `você já está em AFK!` } 
  }
  
  let afkMessages = {
   afk: ['saiu do AFK:'],
   gn: ['acordou:', 'saiu da soneca:'],
   study: ['terminou de estudar:', 'ficou mais inteligente:', 'está cheio de sabedoria:'],
   work: ['saiu do trabalho:', 'terminou de trabalhar:'],
   shower: ['saiu do banho:', 'está limpinho:', 'terminou de se banhar:'],
   food: ['acabou de comer:', 'encheu o bucho:', 'está cheio:'],
   poop: ['acabou de cagar:', 'soltou um barro:'],
   game: ['terminou de jogar:', 'terminou sua jogatina:'],
   read: ['terminou de ler:', 'terminou sua leitura:']
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
      break;
    case 'work':
      afkMessage = `${user.username} foi trabalhar:`
      message += ' 💼';
      break;
    case 'poop':
      afkMessage = `${user.username} foi cagar:`
      message += ' 🚽';
      break;
    case 'game':
      afkMessage = `${user.username} foi jogar:`
      message += ' 🎮';
      break;
    case 'read':
      afkMessage = `${user.username} foi ler:`
      message += ' 📖';
  }
  
  let randomAFK = afkMessages[response];
  let randomAFKMessage = randomAFK[Math.floor(Math.random() * randomAFK.length)] || randomAFK[0];
  
  let afkIndex = afkList.findIndex(i => i.username === user.username);
  await db.query(`INSERT INTO luulbot_afk(username, reason, afk, time, channel, afktype, afkmessage) VALUES($1, $2, $3, $4, $5, $6, $7)`, [user.username, message, response, currentDate, channel, randomAFKMessage, afkMessage])
  
  if(afkIndex >= 0) {
    client.afkList.splice(afkIndex, 1)
  }
  
  afkList.push({username: user.username, reason: message, afk: response, time: currentDate, channel: channel, afkType: randomAFKMessage, afkMessage: afkMessage});
  setTimeout(() =>  client.afkList.splice(afkIndex, 1) , 300000); 
  
  
  return { reply: `${afkMessage} ${message}`, mode: 'say'}
}

module.exports.config = {
 name: 'afk',
 aliases: ['gn', 'study', 'shower', 'food', 'work', 'poop', 'game'],
 usage: 'afk',
 description: 'Seta um afk',
 cooldown: 4000,
 level: 'Todos'
}

