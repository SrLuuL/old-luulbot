module.exports.run = async (context) => {

const db = require('../clients/database.js').db;

if(context.user['message-type'] === 'whisper') {

}


let streamModeDB = await db.query(`SELECT * FROM luulbot_channels WHERE `)

}


module.exports.config = {
name: 'modostream',
aliases: ['streammode', 'sm'],
description: 'Ativa ou desativa o modo stream. O modo stream fará com que o bot não responda mais comandos durante lives',
usage: 'modostream [on/off]',
cooldown: 20000,
level: 'Moderador'
}
