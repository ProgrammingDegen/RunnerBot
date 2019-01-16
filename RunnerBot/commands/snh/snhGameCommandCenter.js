module.exports.run = async (Discord, config, firebase, client, message, args, modeargs) => {
	try {
		let chnid = message.channel.toString();
		chnid = chnid.slice(2, -1);
		let db = firebase.database();
		// dbFetch now contains json information of the game
		let dbFetch = await db.ref("lobbySNH/" + chnid).once("value");
		dbFetch = dbFetch.val();
		// Code "startup"
		if (modeargs === "startup") {
			let gameBoard = dbFetch["gameState"];
			let command = require("./snhGameBoardGenerator.js");
			gameBoard = command.run(gameBoard);
			await message.channel.send("Initiating startup protocols. Please try not to send messages before the game board refreshes.\nYou have 10 seconds to remember the board.");
			// Generate array for possible answers
			let gameStateAnswer = [];
			for (let i = 2; i <= 24; i++) {
				gameStateAnswer.push(i);
			}
			let gameStateAnswerTemp = [27, 28, 30, 32, 33, 35, 36, 40, 42, 44, 45, 48, 50, 54, 55, 56, 60, 63, 66, 70, 72, 77, 80, 84, 88, 90, 96, 99, 108, 110, 120, 132];
			gameStateAnswer = gameStateAnswer.concat(gameStateAnswerTemp);
			// Generate a random entry and purge it from the array
			let randomNumber = Math.floor(Math.random() * gameStateAnswer.length);
			let gameTarget = parseInt(gameStateAnswer.splice(randomNumber, 1));
			await message.channel.send("Game Board:\n" + gameBoard).then((msg) => {
				let schedule = require("node-schedule");
				schedule.scheduleJob(Date.now() + 10000, async function() {
					gameBoard = "ALIEYOUMSTNRHDGK";
					gameBoard = command.run(gameBoard);
					msg.edit("Game Board:\n" + gameBoard);
					// Push status to the db
					await db.ref("lobbySNH/" + chnid).update({
						"gameStateAnswer": gameStateAnswer,
						"gameTarget": gameTarget
					});
					await message.channel.send("The target is: " + gameTarget + ".");
					return;
				});
			});
			return;
		}
		// Code "buzzer"
		else if (modeargs === "buzzer") {
			if (dbFetch === null) {
				await message.channel.send("This channel has no ongoing game.");
				return;
			}
			else if (dbFetch["gameTarget"] === null || dbFetch["gameTarget"] === undefined) {
				await message.channel.send("You cannot answer when there is no target number.");
				return;
			}
			else {
				let uid = message.author.id;
				let pid1 = dbFetch["player1"];
				let pid2 = dbFetch["player2"];
				if (uid != pid1.slice(0, -1) && uid != pid2.slice(0, -1)) {
					await message.channel.send("You are not in a game in this channel.");
					return;
				}
				else {
					if (uid === pid1.slice(0, -1)) {
						if (pid2.slice(-1) === "Y") {
							await message.reply("You lost the buzzer war.");
							return;
						}
						else if (pid1.slice(-1) === "Y") {
							await message.reply("You are already ready.");
							return;
						}
						else {
							await db.ref("lobbySNH/" + chnid).update({
								"player1": pid1.slice(0, -1)+"Y"
							});
							await message.channel.send("Answer rights go to Player 1.");
							return;
						}
					}
					else {
						if (pid1.slice(-1) === "Y") {
							await message.reply("You lost the buzzer war.");
							return;
						}
						else if (pid2.slice(-1) === "Y") {
							await message.reply("You are already ready.");
							return;
						}
						else {
							await db.ref("lobbySNH/" + chnid).update({
								"player2": pid2.slice(0, -1)+"Y"
							});
							await message.channel.send("Answer rights go to Player 2.");
							return;
						}
					}
					return;
				}
				return;
			}
		}			
		// Code "answer"
		else if (modeargs === "answer") {
			if (dbFetch === null) {
				await message.channel.send("This channel has no ongoing game.");
				return;
			}
			let uid = message.author.id;
			let pid1 = dbFetch["player1"];
			let pid2 = dbFetch["player2"];
			if (uid != pid1.slice(0, -1) && uid != pid2.slice(0, -1)) {
				await message.channel.send("You are not in a game in this channel.");
				return;
			}
			else if (dbFetch["gameTarget"] === null || dbFetch["gameTarget"] === undefined) {
				await message.channel.send("You cannot answer when there is no target number.");
				return;
			}
			else {
				if (uid === pid1.slice(0, -1)) {
					if (pid2.slice(-1) === "Y" || pid1.slice(-1) === "N") {
						await message.reply("You do not currently have the answer rights.");
						return;
					}
					else {
						let command = require("./snhGameHandlerAnswer.js");
						let gameState = dbFetch["gameState"];
						let gameTarget = dbFetch["gameTarget"];
						// 0 is incorrect, 1&2 is correct
						let isCorrect = command.run(args[0], gameState, gameTarget);
						// If wrong answer, pass turn to the other player
						if (isCorrect[0] === 0) {
							await db.ref("lobbySNH/" + chnid).update({
								"player1": pid1.slice(0, -1)+"N",
								"player2": pid2.slice(0, -1)+"Y"
							});
							await message.channel.send("Your equation is: " + isCorrect[1] + " " + isCorrect[2] + " " + isCorrect[3] + "." + "\nYou have 5 seconds to memorize this result.").then((msg) => {
								msg.delete(5000);
							});
							await message.channel.send("Incorrect answer. The other player will now have the answer rights.");
							for (let i = 1; i < isCorrect.length; i++) {
								if (isCorrect[i] === 10) { isCorrect[i] = "Z"; }
								else if (isCorrect[i] === 11) { isCorrect[i] = "J"; }
								else if (isCorrect[i] === 12) { isCorrect[i] = "Q"; }
							}
							let gameBoard = "ALIEYOUMSTNRHDGK";
							for (let i = 1; i < isCorrect.length; i++) {
								let index = gameState.indexOf(isCorrect[i]);
								gameBoard = gameBoard.substr(0, index) + isCorrect[i] + gameBoard.substr(index+1);
							}
							command = require("./snhGameBoardGenerator.js");
							gameBoard = command.run(gameBoard);
							await message.channel.send("Game Board:\n" + gameBoard).then((msg) => {
								let schedule = require("node-schedule");
								schedule.scheduleJob(Date.now() + 5000, async function() {
									// Reprint the board and start again
									message.delete();
									gameBoard = "ALIEYOUMSTNRHDGK";
									gameBoard = command.run(gameBoard);
									msg.edit("Game Board:\n" + gameBoard);
									return;
								});
							});
							return;
						}
						// If right answer, continue the game until someone reaches 10 points
						else {
							await db.ref("lobbySNH/" + chnid).update({
								"player1": pid1.slice(0, -1)+"N",
								"player2": pid2.slice(0, -1)+"N",
								"gameTarget": null
							});
							await message.channel.send("Your equation is: " + isCorrect[1] + " " + isCorrect[2] + " " + isCorrect[3] + "." + "\nYou have 5 seconds to memorize this result.").then((msg) => {
								msg.delete(5000);
							});
							for (let i = 1; i < isCorrect.length; i++) {
								if (isCorrect[i] === 10) { isCorrect[i] = "Z"; }
								else if (isCorrect[i] === 11) { isCorrect[i] = "J"; }
								else if (isCorrect[i] === 12) { isCorrect[i] = "Q"; }
							}
							await message.channel.send("Correct answer. You have gained " + isCorrect[0] + " point(s).\nThe number of points you have now is: " + parseInt(dbFetch["player1Score"]+isCorrect[0]) + ".");
							if (dbFetch["player1Score"]+isCorrect[0] >= 10) {
								await message.channel.send("The game has ended with Player 1's victory.");
								await db.ref("lobbySNH/" + chnid).remove();
								return;
							}
							else {
								let gameBoard = "ALIEYOUMSTNRHDGK";
								for (let i = 1; i < isCorrect.length; i++) {
									let index = gameState.indexOf(isCorrect[i]);
									gameBoard = gameBoard.substr(0, index) + isCorrect[i] + gameBoard.substr(index+1);
								}
								command = require("./snhGameBoardGenerator.js");
								gameBoard = command.run(gameBoard);
								await message.channel.send("Game Board:\n" + gameBoard).then((msg) => {
									let schedule = require("node-schedule");
									schedule.scheduleJob(Date.now() + 5000, async function() {
										// Reprint the board, get a new target and start again
										message.delete();
										gameBoard = "ALIEYOUMSTNRHDGK";
										gameBoard = command.run(gameBoard);
										msg.edit("Game Board:\n" + gameBoard);
										// Generate a random entry and purge it from the array
										let gameStateAnswer = dbFetch["gameStateAnswer"];
										let randomNumber = Math.floor(Math.random() * gameStateAnswer.length);
										let gameTarget = parseInt(gameStateAnswer.splice(randomNumber, 1));
										// Push status to the db
										await db.ref("lobbySNH/" + chnid).update({
											"player1": pid1.slice(0, -1)+"N",
											"player1Score": dbFetch["player1Score"]+isCorrect[0],
											"gameStateAnswer": gameStateAnswer,
											"gameTarget": gameTarget
										});
										await message.channel.send("The target is: " + gameTarget + ".");
										return;
									});
								});
								return;
							}
							return;
						}
						return;
					}
				}
				else {
					if (pid1.slice(-1) === "Y" || pid2.slice(-1) === "N") {
						await message.reply("You do not currently have the answer rights.");
						return;
					}
					else {
						let command = require("./snhGameHandlerAnswer.js");
						let gameState = dbFetch["gameState"];
						let gameTarget = dbFetch["gameTarget"];
						// 0 is incorrect, 1&2 is correct
						let isCorrect = command.run(args[0], gameState, gameTarget);
						// If wrong answer, pass turn to the other player
						if (isCorrect[0] === 0) {
							await db.ref("lobbySNH/" + chnid).update({
								"player1": pid1.slice(0, -1)+"Y",
								"player2": pid2.slice(0, -1)+"N"
							});
							await message.channel.send("Your equation is: " + isCorrect[1] + " " + isCorrect[2] + " " + isCorrect[3] + "." + "\nYou have 5 seconds to memorize this result.").then((msg) => {
								msg.delete(5000);
							});
							await message.channel.send("Incorrect answer. The other player will now have the answer rights.");
							for (let i = 1; i < isCorrect.length; i++) {
								if (isCorrect[i] === 10) { isCorrect[i] = "Z"; }
								else if (isCorrect[i] === 11) { isCorrect[i] = "J"; }
								else if (isCorrect[i] === 12) { isCorrect[i] = "Q"; }
							}
							let gameBoard = "ALIEYOUMSTNRHDGK";
							for (let i = 1; i < isCorrect.length; i++) {
								let index = gameState.indexOf(isCorrect[i]);
								gameBoard = gameBoard.substr(0, index) + isCorrect[i] + gameBoard.substr(index+1);
							}
							command = require("./snhGameBoardGenerator.js");
							gameBoard = command.run(gameBoard);
							await message.channel.send("Game Board:\n" + gameBoard).then((msg) => {
								let schedule = require("node-schedule");
								schedule.scheduleJob(Date.now() + 5000, async function() {
									// Reprint the board and start again
									message.delete();
									gameBoard = "ALIEYOUMSTNRHDGK";
									gameBoard = command.run(gameBoard);
									msg.edit("Game Board:\n" + gameBoard);
									return;
								});
							});
							return;
						}
						// If right answer, continue the game until someone reaches 10 points
						else {
							await db.ref("lobbySNH/" + chnid).update({
								"player1": pid1.slice(0, -1)+"N",
								"player2": pid2.slice(0, -1)+"N",
								"gameTarget": null
							});
							await message.channel.send("Your equation is: " + isCorrect[1] + " " + isCorrect[2] + " " + isCorrect[3] + "." + "\nYou have 5 seconds to memorize this result.").then((msg) => {
								msg.delete(5000);
							});
							for (let i = 1; i < isCorrect.length; i++) {
								if (isCorrect[i] === 10) { isCorrect[i] = "Z"; }
								else if (isCorrect[i] === 11) { isCorrect[i] = "J"; }
								else if (isCorrect[i] === 12) { isCorrect[i] = "Q"; }
							}
							await message.channel.send("Correct answer. You have gained " + isCorrect[0] + " point(s).\nThe number of points you have now is: " + parseInt(dbFetch["player2Score"]+isCorrect[0]) + ".");
							if (dbFetch["player2Score"]+isCorrect[0] >= 10) {
								await message.channel.send("The game has ended with Player 2's victory.");
								await db.ref("lobbySNH/" + chnid).remove();
								return;
							}
							else {
								let gameBoard = "ALIEYOUMSTNRHDGK";
								for (let i = 1; i < isCorrect.length; i++) {
									let index = gameState.indexOf(isCorrect[i]);
									gameBoard = gameBoard.substr(0, index) + isCorrect[i] + gameBoard.substr(index+1);
								}
								command = require("./snhGameBoardGenerator.js");
								gameBoard = command.run(gameBoard);

								await message.channel.send("Game Board:\n" + gameBoard).then((msg) => {
									let schedule = require("node-schedule");
									schedule.scheduleJob(Date.now() + 5000, async function() {
										// Reprint the board, get a new target and start again
										message.delete();
										gameBoard = "ALIEYOUMSTNRHDGK";
										gameBoard = command.run(gameBoard);
										msg.edit("Game Board:\n" + gameBoard);
										// Generate a random entry and purge it from the array
										let gameStateAnswer = dbFetch["gameStateAnswer"];
										let randomNumber = Math.floor(Math.random() * gameStateAnswer.length);
										let gameTarget = parseInt(gameStateAnswer.splice(randomNumber, 1));
										// Push status to the db
										await db.ref("lobbySNH/" + chnid).update({
											"player2": pid2.slice(0, -1)+"N",
											"player2Score": dbFetch["player2Score"]+isCorrect[0],
											"gameStateAnswer": gameStateAnswer,
											"gameTarget": gameTarget
										});
										await message.channel.send("The target is: " + gameTarget + ".");
										return;
									});
								});
								return;
							}
							return;
						}
						return;
					}
				}
				return;
			}
			return;
		}
		else {
			message.channel.send("Impossible query detected. Shutting down bot.");
			console.log("The bot broke in snh command center. Please report this issue to the bot creator.");
			return;
		}
} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "snhGameCommandCenter"
}
