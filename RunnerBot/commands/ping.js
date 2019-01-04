module.exports.run = async (client, message, args) => {
	// Calculates ping between sending a message and editing it, giving a nice round-trip latency
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
	try {
		let m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	name: "ping"
}
