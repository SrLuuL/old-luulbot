const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express()


app.get('/', (req, res) => {
res.send({worked: true})
})

app.listen(PORT, () => {
console.log('Servidor rolando!')
})
