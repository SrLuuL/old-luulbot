module.exports.run = async ({args}) => {
  
  const db = require('../clients/database.js').db;
  const ms = require('pretty-ms');
  
  switch(args[0]) {
    case 'afk':
      
      try {
      
      if(!args[1]) return { reply: `insira uma usuário para checar seu AFK :/` };
      
      let afkCheck = await db.query(`SELECT * FROM luulbot_afk WHERE username = '${args[1].toLowerCase()}'`);
      
      if(afkCheck.rows[0]) {
       let {time, reason, username} = afkCheck.rows[0];
       let passedTime = await ms(Date.now() - time, {secondsDecimalDigits: 0});
        
       return { reply: `${username} está AFK por ${passedTime}: ${reason}` }
        
      } else {
       return { reply: `${args[1]} não está AFK` }
      }
        
      } catch(e) {
       return { reply: `pessoa inválida :/` } 
      }
       break;
    case default:
      return { reply: `termos disponíveis: afk` } 
  }
  
}


module.exports.config = {
 name: 'check',
 aliases: ['chk'],
 description: 'Checa informações de termos disponíveis',
 usage: 'check [termo]',
 cooldown: 5000,
 level: 'Todos'
}
