module.exports.run = (client, message, args, username, channel) => {

client.say(channel, `${username}, Bot feito com Node.js, sendo hosteado atualmente na Heroku e conectado em ${client.getChannels().length} canais`)

}

module.exports.config = {
name: 'sobre',
aliases: ['bot','about'],
usage: 'sobre',
description: 'Conta detalhes sobre o bot',
level: 'Todos',
cooldown: 3000    
}
