module.exports.run = async (Discord, config, fs, firebase, client, message, args) => {
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
		if (args.length > 2) {
			return;
		}
		if (args[0] === "ready") {
			let command = require("./rungamesnh/lobby.js");
			let p1 = null;
			let p2 = null;
			let modeargs = "ready";
			command.run(Discord, config, fs, firebase, client, message, p1, p2, modeargs);
			return;
		}
		else if (args[0] === "-c" || args[0] === "cancel") {
			let command = require("./rungamesnh/lobby.js");
			let p1 = null;
			let p2 = null;
			let modeargs = "cancel";
			command.run(Discord, config, fs, firebase, client, message, p1, p2, modeargs);
			return;
		}
		const players = message.mentions.members;
		if (players.length <= 1 || players.length >= 3) {
			await message.channel.send("Invalid command signature.");
			return;
		}
		else if (!args[0].startsWith("<@") || !args[0].endsWith(">") || !args[1].startsWith("<@") || !args[1].endsWith(">")) {
			await message.channel.send("Invalid command signature.");
			return;
		}
		else {
			let p1 = args[0].slice(2, -1);
			let p2 = args[1].slice(2, -1);
			if (p1 === p2) {
				await message.channel.send("You can't just do that without getting away with it.");
				return;
				}
			// if (message.mentions.users.get(p1).bot || message.mentions.users.get(p2).bot) {
			// 	await message.channel.send("Starting a game with a bot? Really?");
			// 	return;
			// }
			let modeargs = "none";
			let command = require("./rungamesnh/lobby.js");
			command.run(Discord, config, fs, firebase, client, message, p1, p2, modeargs);
			return;
		}
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "rungamesnh"
}
