const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const luulbot = require('./clients/discord.js').luulbot;
const client = require('./clients/twitch.js').client;
const db = require('./clients/database.js').db;
const ms = require('pretty-ms');
const channels =  await db.query(`SELECT * FROM luulbot_channels`)

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


<div class='row'>


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

app.get('/', (req, res) => {
res.send(`

<!DOCTYPE html>

<html lang='pt' class='no-js'>

<head>

<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
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

app.get('/suggests', async (req, res) => {
  
 const suggestsList = await db.query('SELECT userchannel, usersuggest, status, suggestdate, suggestid FROM luulbot_suggests ORDER BY suggestid DESC');
 const currentTime  = new Date(new Date().toLocaleString('pt-br', {timeZone: 'America/Bahia'}));
 const suggestTable = suggestsList.rows.map(i => `

<tr>
<td><a>${i.userchannel}</a></td>
<td><a>${i.usersuggest}</a></td>
<td><a>${i.status}</a></td>
<td><a>${ms(currentTime - new Date(i.suggestdate), {unitCount: 2, secondsDecimalDigits: 0})} atrás</a></td>
<td><a>${i.suggestid}</a></td>
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

table th {
    width: auto !important;
}

#suggestsTable_wrapper {
	padding: 10px 30px 0 30px !important;
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

app.get('/canais', async (req, res) => {
  
 const channelsDB = await db.query(`SELECT * FROM luulbot_channels`)

 const channelsTable = channelsDB.rows.map(i => `

<tr>
<td><a>${i.userchannel}</a></td>
<td><a>${i.mode}</a></td>
<td><a>${i.userid}</a></td>
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

td a {
	display: block;
}

td {
	word-break: break-word;
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


<div class='row justify-content-center'>


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


app.listen(PORT, () => {
console.log('Servidor rolando!')
})
