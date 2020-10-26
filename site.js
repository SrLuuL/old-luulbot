const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const luulbot = require('./clients/discord.js').luulbot;
const client = require('./clients/twitch.js').client;

app.get('/comandos', (req, res) => {
  
  let commandList = luulbot.commands.map(i => `
<tr>
<td><a>=${i.config.name}</a></td>
<td><a>[${i.config.aliases || '(nenhum)'}]</a></td>
<td><a>${i.config.description}</a></td>
<td><a>${i.config.usage}</a></td>
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
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css">
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

.dataTables_wrapper, .dataTables_paginate, .paginate_button.current, .dataTables_wrapper, .dataTables_paginate, .paginate_button.current:hover {
background-color: none !important;
color: white !important;
}

.paginate_button.current:hover {

background: none !important;
background-color: #222b36;
color:#fff !important
}

.dataTables_wrapper .dataTables_paginate .paginate_button {

background: none !important;
color: white !important;
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
</ul>
</div>
</nav>


<div class='row justify-content-center'>


<table id='commandsTable' class='table table-dark table-striped table-bordered dataTable'>

<thead>
<tr>
<td>NOME</td>
<td>ALIASES</td>
<td>DESCRIÇÃO</td>
<td>USO</td>
<td>PERMISSÃO</td>
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
}
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
<link rel='icon' href='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>
<meta name="google-site-verification" content="5lSY1P8vB8Tx2Iwm82A1WjUkEmYBc6GkRfSKgXMzvoU" />
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
</ul>
</div>
</nav>

<div class='text-center mainText mx-auto col-xs-1 py-5' >

<br>

<img src='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>

<p> LuuLBot é um simples bot capaz de realizar diversas funções, progamado por SrLuuL com Node.js </p>

<p> Conectado neste momento em ${client.getChannels().length} canais! </p>

</div>

<ul>

<li>

<p><strong> Como faço para colocar o bot no meu canal? </strong></p>

<p> Basta falar com @SrLuuL, ou mande uma sugestão solicitando o bot </p>

</li>

<li>

<p><strong> Como faço para remover o bot do meu canal? </strong></p>

<p> Basta falar com @SrLuuL, mande uma sugestão ou simplesmente bana ele do seu canal </p>

</li>

</ul>



</body>

</html>


`)
})


app.listen(PORT, () => {
console.log('Servidor rolando!')
})
