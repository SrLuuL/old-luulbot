module.exports.run = async ({args, user, channel}) => {

const db = require('../clients/database.js').db;

  
if(user['message-type'] === 'whisper') {
  return { reply: 'Comando não disponível em whispers :P' }
}  

  
let canal = channel.replace('#', '');    
let streamModeDB = await db.query(`SELECT stream_mode FROM luulbot_channels WHERE userchannel = '${canal}'`);
let streamMode = streamModeDB.rows[0]['stream_mode'];
  
switch(args[0]) {
    
  case 'on':
    
    if (streamMode === true) return { reply: 'Modo stream já está ligado :/' }
    
    await db.query(`UPDATE luulbot_channels SET stream_mode = 'true' WHERE userchannel = '${canal}'`)
    
    return { reply: 'Modo stream ligado!' }
    
    break;
    
  case 'off':
    
     if (streamMode === false) return { reply: 'Modo stream já está desligado :/' }
    
    await db.query(`UPDATE luulbot_channels SET stream_mode = 'false' WHERE userchannel = '${canal}'`)
    
    return { reply: 'Modo stream desligado!' }
    
    break;
    
  default:
    
    return { reply: 'Ative ou desative o modo stream com: on/off' }
    
}
  


}


module.exports.config = {
name: 'modostream',
aliases: ['streammode', 'sm'],
description: 'Ativa ou desativa o modo stream. O modo stream fará com que o bot não responda mais comandos durante lives',
usage: 'modostream [on/off]',
cooldown: 5000,
level: 'Moderador'
}
