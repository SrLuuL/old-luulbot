const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const luulbot = require('./clients/discord.js').luulbot;


app.get('/comandos', (req, res) => {
  
  let commandList = luulbot.commands.map(i => `
<tr>
<td><a>${i.config.name}</a></td>
</tr>
`);
  
  
res.send(`
<html lang='pt'>

<head>

<meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title> LuuLBot - Comandos </title>

</head>

<body>

${commandList}

</body>

</html>
`)
})

app.listen(PORT, () => {
console.log('Servidor rolando!')
})
