module.exports.run = () => {

  let channelList = require('../credentials/login.js').channelOptions;
  
return {
 reply: `Bot feito com Node.js, sendo hosteado atualmente na Heroku e conectado em ${channelList.length} canais` 
}

}

module.exports.config = {
name: 'sobre',
aliases: ['bot','about'],
usage: 'sobre',
description: 'Conta detalhes sobre o bot',
level: 'Todos',
cooldown: 3000    
}
