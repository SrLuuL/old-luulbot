module.exports.run = async ({args, user}) => {
  
  const db = require('../clients/database.js').db;
  const ms = require('pretty-ms');
  
  switch(args[0]) {
    case 'afk':
      try {
      
      if(!args[1]) return { reply: `insira um usuário para checar seu AFK :/` };
      let afkSender = args[1].toLowerCase();
        
      if(afkSender === user.username) return { reply: `eu acho que você não está afk O_o` };
      if(afkSender === 'luulbot') return { reply: `estou sempre aqui B)` };  
        
      let afkCheck = await db.query(`SELECT * FROM luulbot_afk WHERE username = '${afkSender}'`);
      
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
    default:
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
