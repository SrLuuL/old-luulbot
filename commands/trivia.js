module.exports.run = async (client, message, args, username, channel) => {

	
	if (trivia.find(i => i.running)) return;
	
	startTrivia()
	
	async function startTrivia() {

		const quiz = require("./data/trivia.json")
		const items = quiz[Math.floor(Math.random() * quiz.length)];
		
		const question = items.question
		const category = items.category
		const answer = items.answer
		
		client.say(channel, `Categoria: ${category} | ${question}`)
		trivia.push({ channel: channel, running: true, answer: answer });
		
		const done = new Promise(resolve => {
			const timer = setTimeout(() => {
				client.say(channel, `Ninguém acertou :/, a resposta era ${answer[0]}`)
				let triviaIndex = trivia.findIndex(i => i.channel === channel);
				trivia.splice(triviaIndex, 1)
				resolve()
			}, 35000)
			
			
			client.on("chat", async (channel, user, message, self) => {
			
			const similarity = compareStrings(message, answer[0])
			
			if (similarity < 0.9) return;
			
			clearTimeout(timer)
			client.say(channel, `${username} acertou!, a resposta era ${answer[0]}`)
			let triviaIndex = trivia.findIndex(i => i.channel === channel);
			trivia.splice(triviaIndex, 1)
			resolve()
			
			})
			
		
			
		})
		
		await done
			 
	}

	
}


module.exports.config = {
name: "trivia",
aliases: ["trivas"],
description: "Manda uma trivia aleatória",
usage: "trivia"
}
