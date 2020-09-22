module.exports.run = async (client, message, args, username, channel) => {

function getRandomHex() {
const hex = [];
const characterList = 'ABCDEFabcdef1234567890'.split('')

for(let i = 0; i < 6; i++) {
hex.push(characterList[Math.floor(Math.random() * characterList.length)])
}

switch(args[0]) {
case 'hex':
client.say(channel, `${username}, #${getRandomHex()}`)
break;
}

}


module.exports.config = {
name: 'random',
aliases: ['rand'],
description: 'Gera um termo aleatório de determinada categoria',
usage: 'random [termo]'
}
