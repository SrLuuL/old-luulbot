module.exports.run = async (context) => {

const cherangi = require('@distributed/cherangi');
const translateapi = require('@kaysilvn/google-translate-api');
const translate = new translateapi().translate;
const fetch = require('node-fetch');
  
const randName = await (await fetch('http://gerador-nomes.herokuapp.com/nomes/1')).json();  
  
async function getRandomHex() {
  
  
const hex = [];
const characterList = 'ABCDEFabcdef1234567890'.split('')

for(let i = 0; i < 6; i++) {
hex.push(characterList[Math.floor(Math.random() * characterList.length)])
}

  const colorName = cherangi(hex.join(''));
  const translatedColor = await translate(colorName.name, { src_lang: 'auto', tar_lang: 'pt' })
  
  return `${hex.join('')} (${translatedColor})`
}
  
(async () => {  
  
switch(context.args[0]) {
  case 'hex':
    return { reply: `#${await getRandomHex()}` }
  case 'name':
    return { reply: `${randName}` }
  default:
    return { reply: 'categorias disponíveis: hex/name' }
}

})()  
  
  
}


module.exports.config = {
name: 'random',
aliases: ['rand'],
description: 'Gera um termo aleatório de determinada categoria',
usage: 'random [categoria]',
level: 'Todos',
cooldown: 5000    
}
