module.exports.run = async (client, message, args, username, channel) => {

const db = require('../clients/database.js').db;
const ms = require('pretty-ms');

const twitchltDB = await db.query('SELECT * FROM luulbot_twitchlt');

if (!twitchltDB.rows) {
return client.say(channel, `${username}, não há imagens no momento :/`)
}


const fetchUrls = twitchltDB.rows.map(i => i.url);

let randomUrl = fetchUrls[Math.floor(Math.random() * fetchUrls.length)];
let randomUrlDate = twitchltDB.rows.find(i => i.url === randomUrl)

randomUrlDate = ms(Date.now() - randomUrlDate.date, {secondsDecimalDigits: 0, unitCount: 2})
.replace(/y/, 'a');

client.say(channel, `${username}, ${randomUrl} (Postada há ${randomUrlDate} atrás)`) 


}

module.exports.config = {
name: 'twitchlotto',
aliases: ['twitchlt', 'lt'],
usage: 'twitchlotto',
description: 'Pega uma imagem aleatória de chats brasileiros',
level: 'Privado'
}
