module.exports.run = async ({client, user}) => {
  
  const db = require('../clients/database.js').db;
  const afkList = client.afkList;

  if(user['message-type'] === 'whisper') {
   return { reply: 'comando não está disponível em whispers!' } 
  }
  
  let afkSearch = afkList.find(i => i.username === user.username);
  let afkIndex = afkList.findIndex(i => i.username === user.username);
  let afkStatus = await db.query(`SELECT * FROM luulbot_afk WHERE username = '${user.username}'`);
  
  if(!afkSearch) {
    
   return { reply: 'nenhum AFK feito há menos de 5 minutos atrás :/' } 
    
  } 
  
  if(afkStatus.rows[0]) {
   
    return { reply: 'você já estava AFK O_o ' }
    
  }
  
  
  if(afkSearch) {
    
    let { username, reason, afk, time, channel, afkType, afkMessage } =  afkSearch;
     
     await db.query(`INSERT INTO luulbot_afk(username, reason, afk, time, channel, afktype, afkmessage) VALUES($1, $2, $3, $4, $5, $6, $7)`, [user.username, reason, afk, time, channel, afkType, afkMessage])
     if(afkIndex === -1) {
       afkList.push(afkSearch);
     }
     setTimeout(() =>  afkList.splice(afkIndex, 1) , 300000); 

     return { reply: 'você voltou com seu AFK anterior' } 
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
