module.exports.run = async (client, message, args, username, channel) => {

const cherangi = require('@distributed/cherangi');
const translateapi = require('@kaysilvn/google-translate-api')
const translate = new translateapi().translate;
  
  
function getRandomHex() {
  
  
const hex = [];
const characterList = 'ABCDEFabcdef1234567890'.split('')

for(let i = 0; i < 6; i++) {
hex.push(characterList[Math.floor(Math.random() * characterList.length)])
}

  const colorName = cherangi(hex.join(''));
  const translatedColor = translate(colorName, { src_lang: 'auto', tar_lang: 'pt' })
  .then(text => { return `${hex.join('')} (${text})` });
  
}
  
switch(args[0]) {
  case 'hex':
    client.say(channel, `${username}, #${getRandomHex()}`)
    break;
  default:
    client.say(channel, `${username}, categorias disponíveis: hex`)
}

}


module.exports.config = {
name: 'random',
aliases: ['rand'],
description: 'Gera um termo aleatório de determinada categoria',
usage: 'random [termo]'
}
