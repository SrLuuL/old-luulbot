const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const luulbot = require('./clients/discord.js').luulbot;
const client = require('./clients/twitch.js').client;
const db = require('./clients/database.js').db;
const ms = require('pretty-ms');
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const wrongPage = `
<!DOCTYPE html>

<html lang='pt' class='no-js'>

<head>

<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<link rel="stylesheet" href="https://bootswatch.com/4/darkly/bootstrap.min.css">
<title> LuuLBot - Sugestões </title>
<link rel='icon' href='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>



</head>

<body>

<style>

body {
background-color: #222b36;
}

h4 {
padding: 100px;
}

</style>

<nav class='navbar navbar-expand navbar-dark bg-dark  navbar-fixed-top'>
<a class='navbar-brand'>LuuLBot</a>
<div class="collapse navbar-collapse" id="navbarNav">
<ul class="navbar-nav">
<li class="nav-item">
<a class="nav-link" href="/">Home</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/comandos">Comandos</a>
</li>
</li>
<li class="nav-item">
<a class="nav-link" href="/suggests">Sugestões</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/canais">Canais</a>
</li>
</ul>
</div>
</nav>


<div class='row justify-content-center'>


<h4> Erro 404 - Página Inválida </h4>

</div>

</body>

</html>
`
app.get('/api/status', (req, res) => {
    res.send({status: 200, online: true})
});

app.get('/api/twitch/badges', async (req, res) => {
	

   try {
		
    const gqlFetch = await (await fetch('https://api.twitch.tv/gql', {
     headers: {
      "Client-ID": process.env.GQL_CLIENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Authorization": process.env.GQL_AUTH
    },
    method: 'POST',
    body: JSON.stringify({
    query: `{badges {title description  badgeImage: imageURL(size:QUADRUPLE) clickURL setID version user{login id}}}`
  })
  })).json();
	
     

res.send({status: 200, badges: gqlFetch.data.badges})

   } catch(e) {
	   res.send({error: 'Não encontrado'})
   }
	
});

app.get('/api/twitch/stream/:channel', async (req, res) => {
	
   let channelSender =  req.params.channel;
   let queryMode = 'login';
   
   if(req.query.id) {
	   queryMode = 'id';
   }

   try {
		
    const gqlFetch = await (await fetch('https://api.twitch.tv/gql', {
     headers: {
      "Client-ID": process.env.GQL_CLIENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Authorization": process.env.GQL_AUTH
    },
    method: 'POST',
    body: JSON.stringify({
    query: `{user(${queryMode}:"${channelSender}") { stream {archiveVideo {download {url}} bitrate averageFPS broadcasterSoftware clipCount codec createdAt lastUpdatedAt id type viewersCount previewImageURL width height broadcaster{login id broadcastSettings {game {displayName} title language isMature}} broadcastLanguage isStreamDropsEnabled}}}`
  })
  })).json();
	
  
if(!gqlFetch.data.user) {
	return res.send({status: 404, channel: channelSender, error: 'esse canal não existe'})
}
	
if(!gqlFetch.data.user.stream) {
	return res.send({status: 404, channel: channelSender, error: 'esse canal não está streamando'})
}	

res.send({status: 200, ...gqlFetch.data.user.stream})

   } catch(e) {
	   res.send({error: 'Não encontrado'})
   }
	
});

app.get('/api/twitch/user/:channel', async (req, res) => {
	
   let channelSender =  req.params.channel;
   let queryMode = 'login';
   
   if(req.query.id) {
	   queryMode = 'id';
   }

   try {
		
    const gqlFetch = await (await fetch('https://api.twitch.tv/gql', {
     headers: {
      "Client-ID": process.env.GQL_CLIENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Authorization": process.env.GQL_AUTH
    },
    method: 'POST',
    body: JSON.stringify({
    query: `{user(${queryMode}:"${channelSender}", lookupType:ALL) {login id displayName chatColor description  createdAt followers {totalCount}  follows {totalCount} profileImageURL(width:300) profileViewCount roles {isAffiliate isGlobalMod isPartner isSiteAdmin isStaff} settings {preferredLanguageTag} chatSettings{chatDelayMs followersOnlyDurationMinutes} badges: selectedBadge{title description setID}}}`
  })
  })).json();
	
  
if(!gqlFetch.data.user) {
	return res.send({status: 404, channel: channelSender, error: 'esse usuário não existe'})
}

  
if(!gqlFetch.data.user.settings.preferredLanguageTag) {
	return res.send({status: 200, banned: true, ...gqlFetch.data.user})
}	   

res.send({status: 200, banned: false, ...gqlFetch.data.user})

   } catch(e) {
	   res.send({error: 'Não encontrado'})
   }
	
});

app.get('/api/twitch/modsvips/:channel', async (req, res) => {
	
   let channelSender =  req.params.channel;
   

   try {
		
    const gqlFetch = await (await fetch('https://api.twitch.tv/gql', {
     headers: {
      "Client-ID": process.env.GQL_CLIENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Authorization": process.env.GQL_AUTH
    },
    method: 'POST',
    body: JSON.stringify({
    query: `{user(login:"${channelSender}", lookupType:ALL) {mods(first:100) {pageInfo{hasNextPage} edges {node{login displayName id} grantedAt cursor}} vips(first:100){pageInfo{hasNextPage}edges {node{login displayName id} grantedAt cursor}}}}`
  })
  })).json();
	
  
if(!gqlFetch.data.user) {
	return res.send({status: 404, channel: channelSender, error: 'esse usuário não existe'})
}

let modList = gqlFetch.data.user.mods.edges.filter(i => i.node).map(i => Object.assign(i.node, {grantedAt: i.grantedAt}));
let vipList = gqlFetch.data.user.vips.edges.filter(i => i.node).map(i => Object.assign(i.node, {grantedAt: i.grantedAt}));	   	   

 let modPage = gqlFetch.data.user.mods.pageInfo.hasNextPage;
 let vipPage = gqlFetch.data.user.vips.pageInfo.hasNextPage;
 let gqlFetchVip, gqlFetchMod;
 let vipCursor, modCursor;
  
  
  if(vipPage) {
      vipCursor = gqlFetch.data.user.vips.edges.filter(i => i.node).map(i => i.cursor);
  }
  
   if(modPage) {
      modCursor = gqlFetch.data.user.mods.edges.filter(i => i.node).map(i => i.cursor);
  }
  
  
  do {
    if(vipPage) {
      gqlFetchVip = await (await fetch('https://api.twitch.tv/gql', {
     headers: {
      "Client-ID": process.env.GQL_CLIENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Authorization": process.env.GQL_AUTH
    },
    method: 'POST',
    body: JSON.stringify({
    query: `{user(login:"${channelSender}", lookupType:ALL) {vips(first:100, after:"${vipCursor[vipCursor.length - 1]}"){pageInfo{hasNextPage}edges {node{login displayName id} grantedAt cursor}}}}`
  })
  })).json();
      
      vipPage = gqlFetchVip.data.user.vips.pageInfo.hasNextPage;
      
      vipList.push(...gqlFetchVip.data.user.vips.edges.filter(i => i.node).map(i => Object.assign(i.node, {grantedAt: i.grantedAt})))
      
      vipCursor = gqlFetchVip.data.user.vips.edges.filter(i => i.node).filter(i => i.cursor).map(i => i.cursor);
      
    }

    if(modPage) {
	    
      gqlFetchMod = await (await fetch('https://api.twitch.tv/gql', {
     headers: {
      "Client-ID": process.env.GQL_CLIENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Authorization": process.env.GQL_AUTH
    },
    method: 'POST',
    body: JSON.stringify({
    query: `{user(login:"${channelSender}", lookupType:ALL) {mods(first:100, after:"${modCursor[modCursor.length - 1]}"){pageInfo{hasNextPage}edges {node{login displayName id} grantedAt cursor}}}}`
  })
  })).json();
      
	    
      modPage = gqlFetchMod.data.user.mods.pageInfo.hasNextPage;
      
      modList.push(...gqlFetchMod.data.user.mods.edges.filter(i => i.node).map(i => Object.assign(i.node, {grantedAt: i.grantedAt})))
      
      modCursor = gqlFetchMod.data.user.mods.edges.filter(i => i.node).filter(i => i.cursor).map(i => i.cursor);
      
    }
  } while(modPage || vipPage)	   

res.send({status: 200, mods: modList, vips: vipList})

   } catch(e) {
	   res.send({error: 'Não encontrado'})
   }
	
});

app.get('/api/twitch/sub/:user/:channel', async (req, res) => {
	
   let userSender = req.params.user;	
   let channelSender =  req.params.channel;	

   try {
		
    const gqlFetchChannel = await (await fetch('https://api.twitch.tv/gql', {
     headers: {
      "Client-ID": process.env.GQL_CLIENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Authorization": process.env.GQL_AUTH
    },
    method: 'POST',
    body: JSON.stringify({
    query: `{user(login:"${channelSender}", lookupType:ALL) {channel: login channelID: id}}`
  })
  })).json();
	
if (!gqlFetchChannel.data.user) {
	return res.send({status: 404, channel: channelSender, error: 'esse canal não existe'})
}
	
let channelID = gqlFetchChannel.data.user.channelID;	   

    const gqlFetchSub = await (await fetch('https://api.twitch.tv/gql', {
     headers: {
      "Client-ID": process.env.GQL_CLIENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Authorization": process.env.GQL_AUTH
    },
    method: 'POST',
    body: JSON.stringify({
    query: `{user(login:"${userSender}", lookupType:ALL) {username: login userID: id relationship(targetUserID:${channelID}) {subscription: subscriptionBenefit {gift{giftDate gifter {login id}} endsAt isDNRd renewsAt tier type: purchasedWithPrime} streak: subscriptionTenure(tenureMethod: STREAK){months remaining: daysRemaining elapsed: elapsedDays end start} cumulative: subscriptionTenure(tenureMethod: CUMULATIVE){months remaining: daysRemaining elapsed: elapsedDays end start}}}}`
  })
  })).json();	   
	   	   
	   
if (!gqlFetchSub.data.user) {
	return res.send({status: 404, username: userSender, error: 'esse usuário não existe'})
}
	   
let subStatus = gqlFetchSub.data.user.relationship;
	   
	   	   
	   
let subCheck = (subStatus.subscription) ? true : false;   
let hiddenCheck = (!subStatus.streak && !subStatus.cumulative) ? true : false; 	   	
	   
if(subCheck) {
	subStatus.subscription.tier = subStatus.subscription.tier/1000;
	
	if(subStatus.subscription.type) {
	subStatus.subscription.type = 'Prime'	
} else {
	if(subStatus.subscription.gift.gifter) {
		subStatus.subscription.type = 'Gift'
	} else {
		subStatus.subscription.type = 'Paid'
	}
}

}
	   	
res.send({status: 200, username: gqlFetchSub.data.user.username, userid: gqlFetchSub.data.user.userID, ...gqlFetchChannel.data.user, hidden: hiddenCheck, subscribed: subCheck, ...subStatus});	   

   } catch(e) {
	   res.send({error: 'Não encontrado'})
   }
	
});

app.get('/comandos', (req, res) => {
  
let commandList = luulbot.commands.filter(i => i.config.level !== 'Dono');
commandList = commandList.map(i => `
<tr>
<td><a>=${i.config.name}</a></td>
<td><a>[${i.config.aliases || '(nenhum)'}]</a></td>
<td><a>${i.config.description}</a></td>
<td><a>${i.config.usage}</a></td>
<td><a>${(i.config.cooldown/1000)} segundos</a></td>
<td><a>${i.config.level}</a></td>
</tr>
`);
  
  
res.send(`
<!DOCTYPE html>

<html lang='pt' class='no-js'>

<head>

<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<link rel="stylesheet" href="https://bootswatch.com/4/darkly/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.22/css/dataTables.bootstrap5.min.css">
<title> LuuLBot - Comandos </title>
<link rel='icon' href='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>
<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>



</head>

<body>

<style>

body {
background-color: #222b36;
}

table th {
    width: auto !important;
}

#commandsTable_wrapper {
	padding: 10px 30px 0 30px !important;
}

td {
  padding: 0.55rem !important;
}

</style>

<nav class='navbar navbar-expand navbar-dark bg-dark  navbar-fixed-top'>
<a class='navbar-brand'>LuuLBot</a>
<div class="collapse navbar-collapse" id="navbarNav">
<ul class="navbar-nav">
<li class="nav-item">
<a class="nav-link" href="/">Home</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/comandos">Comandos</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/suggests">Sugestões</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/canais">Canais</a>
</li>
</ul>
</div>
</nav>


<div class='table-responsive'>


<table id='commandsTable' class='table table-dark table-striped table-bordered  dataTable' role='grid'>

<thead>
<tr>
<td>NOME</td>
<td>ALIASES</td>
<td>DESCRIÇÃO</td>
<td>USO</td>
<td>COOLDOWN</td>
<td>NÍVEL</td>
</tr>
</thead>

<tbody>
${commandList.join(' \n')}
</tbody>
</table>
</div>

<script>

$(document).ready(function () {
  $('#commandsTable').DataTable({
        "language": {
"url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json"
},
        "pageLength": 100
    });
});

</script>


</body>

</html>
`)
})

app.get('/', async (req, res) => {
	
let channels =  await db.query(`SELECT * FROM luulbot_channels`)  	
	
res.send(`

<!DOCTYPE html>

<html lang='pt' class='no-js'>

<head>

<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:image" content="https://cdn.betterttv.net/emote/6018520a82cf6865d553941a/3x">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<title> LuuLBot - Home </title>
<link rel="stylesheet" href="https://bootswatch.com/4/darkly/bootstrap.min.css">
<link rel='icon' href='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>
</head>

<body>

<style>

body {
background-color: #222b36;
color: #ffffff
}

img {
padding: 15px;
}

</style>


<nav class='navbar navbar-expand navbar-dark bg-dark  navbar-fixed-top'>
<a class='navbar-brand'>LuuLBot</a>
<div class="collapse navbar-collapse" id="navbarNav">
<ul class="navbar-nav">
<li class="nav-item">
<a class="nav-link" href="/">Home</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/comandos">Comandos</a>
</li>
</li>
<li class="nav-item">
<a class="nav-link" href="/suggests">Sugestões</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/canais">Canais</a>
</li>
</ul>
</div>
</nav>

<div class='text-center mainText mx-auto col-xs-1 py-5' >

<br>

<img src='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>

<p> LuuLBot é um simples bot capaz de realizar diversas funções, progamado por SrLuuL com Node.js </p>

<p> Conectado neste momento em ${channels.rows.length} canais! </p>

</div>

<div class='d-flex'>

<ul class='mx-auto justify-content-center'>

<li>

<p><strong> Como faço para colocar o bot no meu canal? </strong></p>

<p> Basta falar com @SrLuuL, ou mande uma sugestão solicitando o bot(precisa estar sem followmode)</p>

</li>

<li>

<p><strong> Como faço para remover o bot do meu canal? </strong></p>

<p> Fale com @SrLuuL ou simplesmente bana ele do seu canal </p>

</li>

</ul>

</div>

</div>

</body>

</html>


`)
})

app.get('/suggests/', async (req, res) => {
	
 
 const suggestsList = await db.query('SELECT * FROM luulbot_suggests ORDER BY suggestid DESC');
 const currentTime  = new Date(new Date().toLocaleString('pt-br', {timeZone: 'America/Bahia'}));
 const suggestTable = suggestsList.rows.map(i => `
 
<tr>
<td><a>${i.userchannel}</a></td>
<td><a>${i.usersuggest}</a></td>
<td><a>${i.status}</a></td>
<td><a>${moment.tz(i.suggestdate, 'America/Bahia').locale('pt').fromNow()} atrás</a></td>
<td><a href='/suggests/${i.suggestid}'>${i.suggestid}</a></td>
</tr>

`);
 
  
res.send(`
<!DOCTYPE html>

<html lang='pt' class='no-js'>

<head>
 
<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<link rel="stylesheet" href="https://bootswatch.com/4/darkly/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.22/css/dataTables.bootstrap5.min.css">
<title> LuuLBot - Sugestões </title>
<link rel='icon' href='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>
<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>



</head>

<body>

<style>

body {
background-color: #222b36;
}


#suggestsTable_wrapper {
	padding: 10px 30px 0 30px !important;
}

td {
  padding: 0.55rem !important;
}

</style>

<nav class='navbar navbar-expand navbar-dark bg-dark  navbar-fixed-top'>
<a class='navbar-brand'>LuuLBot</a>
<div class="collapse navbar-collapse" id="navbarNav">
<ul class="navbar-nav">
<li class="nav-item">
<a class="nav-link" href="/">Home</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/comandos">Comandos</a>
</li>
</li>
<li class="nav-item">
<a class="nav-link" href="/suggests">Sugestões</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/canais">Canais</a>
</li>
</ul>
</div>
</nav>


<div class='table-responsive'>


<table id='suggestsTable' class='table table-dark table-striped table-bordered  dataTable' role='grid'>

<thead>
<tr>
<td>USUÁRIO</td>
<td>SUGESTÃO</td>
<td>STATUS</td>
<td>TEMPO</td>
<td>ID</td>
</tr>
</thead>

<tbody>
${suggestTable.join(' \n')}
</tbody>
</table>
</div>

<script>

$(document).ready(function () {
  $('#suggestsTable').DataTable({
        "language": {
"url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json"
},
       "order": [[ 4, "desc" ]],
       "pageLength": 50
    });
});

</script>


</body>

</html>
`)
})

app.get('/suggests/:id', async (req, res) => {
	
 let queryId = req.params.id;
	
 if(isNaN(queryId)) {
  return res.send(wrongPage)	 
 }
	
 const suggestsList = await db.query(`SELECT * FROM luulbot_suggests WHERE suggestid = '${queryId}'`);

 if (!suggestsList.rowCount) {
	  res.send(wrongPage)
 } else {
	
	
 const suggestTable = suggestsList.rows[0];
 
 
  
res.send(`
<!DOCTYPE html>

<html lang='pt' class='no-js'>

<head>

<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<link rel="stylesheet" href="https://bootswatch.com/4/darkly/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.22/css/dataTables.bootstrap5.min.css">
<title> LuuLBot - Sugestões </title>
<link rel='icon' href='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js"></script>


</head>

<body>

<style>

body {
background-color: #222b36;
}

table th {
    width: auto !important;
}

.table-responsive {
	padding: 10px 30px 0 30px !important;
}

td {
  padding: 0.55rem !important;
}

</style>

<nav class='navbar navbar-expand navbar-dark bg-dark  navbar-fixed-top'>
<a class='navbar-brand'>LuuLBot</a>
<div class="collapse navbar-collapse" id="navbarNav">
<ul class="navbar-nav">
<li class="nav-item">
<a class="nav-link" href="/">Home</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/comandos">Comandos</a>
</li>
</li>
<li class="nav-item">
<a class="nav-link" href="/suggests">Sugestões</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/canais">Canais</a>
</li>
</ul>
</div>
</nav>


<div class='table-responsive'>

<table id='suggestsTable' class='table table-dark table-striped table-bordered dataTable' role='grid'>



<tr>
<td>USUÁRIO</td>
<td>${suggestTable.userchannel}</td>
</tr>
<tr>
<td>SUGESTÃO</td>
<td>${suggestTable.usersuggest}</td>
</tr>
<tr>
<td>STATUS</td>
<td>${suggestTable.status}</td>
</tr>
<tr>
<td>DETALHES</td>
<td>${suggestTable.details || ''}</td>
</tr>
<tr>
<td>DATA</td>
<td>${moment.tz(suggestTable.suggestdate, 'America/Bahia').locale('pt').format('LLLL')}</td>
</tr>
<tr>
<td>ID</td>
<td>${suggestTable.suggestid}</td>
</tr>



<script>

$(document).ready(function () {
  $('#suggestsTable').DataTable({})
});

</script>


</table>
</div>


</body>

</html>
`)	 
 }	
})

app.get('/canais', async (req, res) => {
  
 const channelsDB = await db.query(`SELECT * FROM luulbot_channels`)

 const channelsTable = channelsDB.rows.map(i => `

<tr>
<td><a>${i.userchannel}</a></td>
<td><a>${i.mode}</a></td>
<td><a>${i.useruid}</a></td>
</tr>

`);
 
  
res.send(`
<!DOCTYPE html>

<html lang='pt' class='no-js'>

<head>

<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<link rel="stylesheet" href="https://bootswatch.com/4/darkly/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.22/css/dataTables.bootstrap5.min.css">
<title> LuuLBot - Canais </title>
<link rel='icon' href='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>
<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>



</head>

<body>

<style>

body {
background-color: #222b36;
}

table th {
    width: auto !important;
}

#channelsTable_wrapper {
	padding: 10px 30px 0 30px !important;
}


td {
  padding: 0.55rem !important;
}

</style>

<nav class='navbar navbar-expand navbar-dark bg-dark  navbar-fixed-top'>
<a class='navbar-brand'>LuuLBot</a>
<div class="collapse navbar-collapse" id="navbarNav">
<ul class="navbar-nav">
<li class="nav-item">
<a class="nav-link" href="/">Home</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/comandos">Comandos</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/suggests">Sugestões</a>
</li>
<li class="nav-item">
<a class="nav-link" href="/canais">Canais</a>
</li>
</ul>
</div>
</nav>


<div class='table-responsive'>


<table id='channelsTable' class='table table-dark table-striped table-bordered  dataTable' role='grid'>

<thead>
<tr>
<td>CANAL</td>
<td>MODO</td>
<td>ID</td>
</tr>
</thead>

<tbody>
${channelsTable.join(' \n')}
</tbody>
</table>
</div>

<script>

$(document).ready(function () {
  $('#channelsTable').DataTable({
        "language": {
"url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json"
},
       "order": [[ 2, "desc" ]],
       "pageLength": 50
    });
});

</script>


</body>

</html>
`)
})

app.all('*', function(req, res) {
  res.send(wrongPage);
});

app.listen(PORT, () => {
console.log('Servidor rolando!')
})
