const db = require('../clients/database.js').db;
const channels = require('../credentials/login.js').channelOptions;
const client = require('../clients/twitch.js').client;
const fetch = require('node-fetch');

// Insert data of all conected channels

client.Channels = new Map();

setInterval(() => {
  
  channels.forEach(async (channel) => {
    
   let channelDB = await db.query(`SELECT * FROM luulbot_channels WHERE userchannel = '${channel}'`);
   let { userchannel, userid, useruid, status, mode, stream_mode } = channelDB.rows[0]
   
   client.Channels.set(channel, { channel: userchannel, id: userid, uid: useruid, status: status, mode: mode, stream_mode: stream_mode } );
    
  })
  
}, 1800000)


// Keep the bot alive

setInterval(async () => {
  let server;
  
  try {
  server = await (await fetch('https://luulbot.herokuapp.com/api/status')).json();
  } catch(e) {
    console.warn(`Um erro aconteceu ao pingar o server: ${e.message}`); 
  }
  
}, 20*60*1000)

