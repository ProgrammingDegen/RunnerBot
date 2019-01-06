module.exports.run = async (Discord, config, fs, client, message, args) => {
	try {
		if (typeof args[0] === "undefined" || args[0] === "help") {
			let embed = new Discord.RichEmbed()
				.setAuthor("RunnerBot")
				.setTitle("rungamesnh")
				.setDescription("[I promise to mark up everything later]\nInitiate a game of SNH.\nStart by mentioning 2 players. The players must then confirm their entries in the channel that the command was started in 5 minutes for the game to be hosted.\n"+
					"Rules of the game:\n[TEST]\n"+`Command signature:\n${config.prefix}rungamesnh [@PLAYER1] [@PLAYER2] [MODE (Optional)]\nMode signatures: [I haven't thought this far yet]`);
			await message.channel.send(embed);
			return;
		}
		if (args.length > 3) {
			return;
		}
		if (args[0] === "ready") {
			// Check for ready protocols
			// Cross compare the json for userid of sender, if a game is found go through to validation
		}
		const players = message.mentions.members;
		if (!players) {
			await message.channel.send("No mentions found.");
			return;
		}
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	name: "rungamesnh"
}
