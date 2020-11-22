module.exports.run = (context) => {

  let channelList = context.getChannels().length
  
return {
 reply: `Bot feito com Node.js, sendo hosteado atualmente na Heroku e conectado em ${channelList} canais` 
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
