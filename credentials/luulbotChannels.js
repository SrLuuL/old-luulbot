const db = require("../clients/database.js").db

const getChannels = () => new Promise((resolve, reject) => {
db.query(`SELECT * FROM luulbot_channels`, (err, results) => {
if (err) {throw err} else {resolve(results.rows)}
});
});

let channelList = [];
let channelOptions = [];

async function res() {
channelList.push(await getChannels());
await channelList[0].forEach(i => channelOptions.push(i.channel))
}

res()

function sleepGlob(ms) {
var start = new Date().getTime();
for (var i = 0; i < 1e7; i++) {
if ((new Date().getTime() - start) > ms) {break}
}
}

sleepGlob(1500);

module.exports = {channelOptions}
