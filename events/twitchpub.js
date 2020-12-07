const db = require('../clients/database.js').db;
const WS = require('ws');
const RWS = require('reconnecting-websocket');
const channels = require('../credentials/login.js').channelOptions;
const randombytes = require('randombytes');


function sleep(milliseconds) {
    const start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
	if ((new Date().getTime() - start) > milliseconds) {
		break;
	}
   }
}

sleep(2500)	

const ps = new RWS('wss://pubsub-edge.twitch.tv', [], {WebSocket: WS}); 

ps.addEventListener('open', async () => {
    console.log(`Conectado na TwitchPubSub`);
    for(channel in Object.values(channels)){
        await listenStreamStatus(channels[channel])
    }
});

ps.addEventListener('message', async ({data}) => {
  let msg = JSON.parse(data)
  
  switch(msg.type) {
      
    case 'PONG':
      break;
      
    case 'RESPONSE':
      if (msg.error) {
        console.error(msg.error);
      }
      break;
		  
    case 'RECONNECT':
      console.log('Reconectado ao TwitchPubSub');
      ps.reconnect();
      break;
		  
    case 'MESSAGE':
      if (msg.data) {
       
        let msgData = JSON.parse(msg.data.message);
        let msgTopic = msg.data.topic
	      
        switch(msgData.type) {
            
          case 'stream-up':
          case 'stream-down':
            await handleWSMsg({channel: msgTopic.replace('video-playback.', ''), type: msgData.type});
            break;
        }
        
      }
     
  }
  

});


async function handleWSMsg(msg = {}) {
  
  if (msg) {
   switch(msg.type) {
     case 'stream-up':
         
        await db.query(`UPDATE luulbot_channels SET status='live' WHERE userchannel='${msg.channel}'`);
        break; 
     case 'stream-down':
       
        await db.query(`UPDATE luulbot_channels SET status='offline' WHERE userchannel='${msg.channel}'`);                 
}
    
  }
  
}

async function listenStreamStatus(channel) {
	
	let tokenDB = await db.query(`SELECT setting FROM luulbot_info WHERE setting = 'access_token' `);
	let token = tokenDB.rows[0].access_token;
	
	let nonce = randombytes(20).toString('hex').slice(-8);
	
	 let message = {
        'type': 'LISTEN',
        'nonce': nonce,
        'data': {
            'topics': [`video-playback.${channel}`],
            'auth_token': token,
        },
    };
	
 ps.send(JSON.stringify(message)); 
	
}


setInterval(() => { 
    ps.send(JSON.stringify({
        type: 'PING',
    }));
}, 300000);

