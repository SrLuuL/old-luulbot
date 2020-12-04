const db = require('../clients/database.js').db;
const WS = require('ws');
const RWS = require('reconnecting-websocket');
const channels = require('../credentials/loginjs').channelOptions;

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

ps.addEventListener('open', () => {
    console.log(`Conectado na TwitchPubSub`);	
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
      
    case 'MESSAGE':
      if (msg.data) {
       
        let msgData = JSON.parse(msg.data.message);
        
        switch(msgData.type) {
            
          case 'stream-up':
          case 'stream-down':
            await handleWSMsg({channel: msgData.channel, type: msgData.type});
            break;
        }
        
      }
     
	  default:
		  console.log(`Mensagem PubSub desconhecida: ${msg.type}`)
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


setInterval(() => { 
    ps.send(JSON.stringify({
        type: 'PING',
    }));
}, 250 * 1000);

