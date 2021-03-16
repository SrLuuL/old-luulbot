module.exports.run = async ({client, user}) => {
  
  const db = require('../clients/database.js').db;
  const afkList = client.afkList;

  
  let afkSearch = afkList.find(i => i.username === user.username);
  
  if(!afkSearch) {
    
   return { reply: 'nenhum AFK feito há menos de 5 minutos atrás :/' } 
    
  } else {
   
  let { username, reason, afk, time, channel, afkType, afkMessage } = afkSearch;
  await db.query(`INSERT INTO luulbot_afk(username, reason, afk, time, channel, afktype) VALUES($1, $2, $3, $4, $5, $6)`, [user.username, reason, afk, time, channel, afkType])
  
    return { reply: `${afkMessage} ${reason}`, mode: 'say' }
    
  }
  
}

module.exports.config = {
 name: 'resumeafk',
 aliases: ['rafk'],
 description: 'Resume seu AFK se ele foi feito há menos de 5 minutos atrás',
 usage: 'resumeafk',
 cooldown: 5000,
 level: 'Todos'
}
