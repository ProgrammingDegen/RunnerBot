module.exports.run = async (Discord, config, firebase, client, message, args) => {
	try {
		if (typeof args[0] === "undefined" || args[0] === "help") {
			let embed = new Discord.RichEmbed()
				.setAuthor(`${config.bot_name}`, `${config.bot_avatar_url}`)
				.setTitle("snh")
				.setDescription(`The command for the actual SNH game itself.\nFor how to play the game, try ${config.prefix}snh rules.\n`+
					`Arguments:\nb: Press the buzzer for the answer rights. Have to be lowercase.\n[3 game board letters]: Answer the question. Have to be uppercase.`)
				.setThumbnail(`${config.bot_avatar_url}`);
			await message.channel.send(embed);
			return;
		}
		else if (args[0] === "rules") {
			let embed = new Discord.RichEmbed()
			.setAuthor(`${config.bot_name}`, `${config.bot_avatar_url}`)
			.setTitle("SNH Rules")
			.setDescription("The Rules of SNH\nEach player will have to memorize the back of a 4x4 game board and complete equations which will result in a target number.\n"+
				"There will be the numbers 1 to 12 and plus, multiplication and division signs. There is also a special sign \u221A which stands for sqrt(x)+sqrt(y).\n"+
				"When the game begins, the back of the board will be shown for 10 seconds. The game will continue until one player earns 10 points.\n"+
				"A target number will be shown each round, all of which are natural numbers and can be made using the numbers and signs on the board.\n"+
				"When a target number is revealed, you must recall the numbers and signs behind the board and complete an equation that results in the target number.\n"+
				"The rules for the equation are:\nOne: Equations must consist of two numbers and one sign.\nTwo: You may not use a number or sign more than once.\n"+
				"Three: When the target number is revealed, the player who presses the buzzer first will get to answer within 5 seconds. If the turn player answers incorrectly, their opponent will be given a chance to answer without a time limit.\n"+
				"Four: You must answer by typing out the three letters in the order of number->sign->number. When using the sqrt expression, you must answer in the order of x->sqrt->y.\n"+
				"The two players will take turns answering until the target number is made.\n"+
				"The first player to make the target number gains 1 point. If you complete an equation with the sqrt operation, you will gain 2 points.\n"+
				"The current round will end when one player answers correctly. The game will continue in this way until one player earns 10 points or more and wins the game.")
			.setThumbnail(`${config.bot_avatar_url}`);
			await message.channel.send(embed);
			return;
		}
		if (args.length > 1) {
			return;
		}
		else if (args[0] != "b" && args[0].length != 3) {
			return;
		}
		else {
			if (args[0] === "b") {
				let command = require("./snh/snhGameCommandCenter.js");
				let modeargs = "buzzer";
				command.run(Discord, config, firebase, client, message, args, modeargs);
				return;
			}
			let answer = args[0];
			for (i = 0; i < answer.length; i++) {
				let gameBoard = ["A", "L", "I", "E", "Y", "O", "U", "M", "S", "T", "N", "R", "H", "D", "G", "K"];
				if (gameBoard.indexOf(answer.charAt(i)) > -1) { continue; }
				return;
			}
			let answerString = args[0].toString();
			if (answerString.charAt(0) === answerString.charAt(1) || answerString.charAt(1) === answerString.charAt(2) || answerString.charAt(0) === answerString.charAt(2)) {
				return;
			}
			let command = require("./snh/snhGameCommandCenter.js");
			let modeargs = "answer";
			command.run(Discord, config, firebase, client, message, args, modeargs);
			return;
		}
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "snh"
}
