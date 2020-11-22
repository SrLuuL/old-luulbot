module.exports.run = async (context) => {

const db = require('../clients/database.js').db;
const ms = require('pretty-ms');

const twitchltDB = await db.query('SELECT * FROM luulbot_twitchlt');

if (!twitchltDB.rowCount) {
return { reply: 'sem imagens no momento' }
}


const fetchUrls = twitchltDB.rows.map(i => i.url);

let randomUrl = fetchUrls[Math.floor(Math.random() * fetchUrls.length)];
let randomUrlDate = twitchltDB.rows.find(i => i.url === randomUrl)

randomUrlDate = ms(Date.now() - randomUrlDate.date, {secondsDecimalDigits: 0, unitCount: 2})
.replace(/y/, 'a');

if(context.args[0] === 'stats') {
  return { reply: `${fetchUrls.length} imagens armazenadas neste momento` }
}
  
return {
 reply: `${randomUrl} (Postada há ${randomUrlDate} atrás)` 
}


}

module.exports.config = {
name: 'twitchlotto',
aliases: ['twitchlt', 'tl'],
usage: 'twitchlotto',
description: 'Pega uma imagem aleatória de chats brasileiros(incluindo NSFW), fale com SrLuuL caso queira o comando no seu canal',
level: 'Privado',
cooldown: 6000    
}
