module.exports.run = async ({args, channel}) => {

 const db = require('../clients/database.js').db 
 let prefixSender = args[0];
 let invisChar  = /\uFFF0/;  
 let canal = channel.replace('#', '');
 let currentPrefix = await db.query(`SELECT prefix FROM luulbot_channels WHERE userchannel = '${canal}'`);
 currentPrefix = currentPrefix.rows[0].prefix;
  
 if(!prefixSender) {
   return { reply: `Insira um prefixo | Prefixo atual: ${currentPrefix}` }
 }
  
 if(prefixSender.match(invisChar)) {
  return { reply: 'Prefixo inválido :/' } 
 }
  
  if(prefixSender.length > 3) {
   return { reply: 'Insira um prefixo menor que 3 caracteres :/' }
 }

 await db.query(`UPDATE luulbot_channels SET prefix = '${prefixSender}' WHERE userchannel = '${canal}'`)
  
 return {
  reply: `Prefixo atualizado! | Prefixo atual: ${prefixSender}` 
 }
  
}

module.exports.config = {
 name: 'prefixo',
 aliases: ['prefix'],
 description: 'Muda o prefixo do bot',
 usage: 'prefixo [pref]',
 level: 'Moderador',
 cooldown: 5000
}
