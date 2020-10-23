const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const luulbot = require('./clients/discord.js').luulbot;


app.get('/comandos', (req, res) => {
  
  let commandList = luulbot.commands.map(i => `
<tr>
<td><a>${i.config.name}</a></td>
<td><a>${i.config.aliases || '(nenhum)'}</a></td>
<td><a>${i.config.description}</a></td>
<td><a>${i.config.usage}</a></td>
<td><a>${i.config.level}</a></td>
</tr>
`);
  
  
res.send(`
<html lang='pt'>

<head>

<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<title> LuuLBot - Comandos </title>
<link rel='icon' href='https://cdn.frankerfacez.com/010a6a6829cfe953dbe1958557424bc4.png'>

</head>

<body>

<style>

body {
background-color: #222b36;
}

</style>

<table class='table table-dark thead-light table-striped justify-content-center' style='width: auto;'>

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


</body>

</html>
`)
})

app.listen(PORT, () => {
console.log('Servidor rolando!')
})
