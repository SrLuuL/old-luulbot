module.exports.run = async (context) => {

const cherangi = require('@distributed/cherangi');
const translateapi = require('@kaysilvn/google-translate-api');
const translate = new translateapi().translate;
const fetch = require('node-fetch');
  
const randName = await (await fetch('http://www.wjr.eti.br/nameGenerator/index.php?q=1&o=json')).json();  
  
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
  
let randomHex  = await getRandomHex()
  
switch(context.args[0]) {
  case 'hex':
    return { reply: `#${randomHex}` }
    break;
  case 'name':
    return { reply: `${randName[0]}` }
    break;
  default:
    return { reply: 'categorias disponíveis: hex/name' }
}


  
  
}


module.exports.config = {
name: 'random',
aliases: ['rand'],
description: 'Gera um termo aleatório de determinada categoria',
usage: 'random [categoria]',
level: 'Todos',
cooldown: 5000    
}
