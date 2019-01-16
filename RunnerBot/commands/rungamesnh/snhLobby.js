module.exports.run = async (Discord, config, firebase, client, message, p1, p2, modeargs) => {
	// TODO possibly disable game cancelling when game has already started
	try {
		let chnid = message.channel.toString();
		chnid = chnid.slice(2, -1);
		let db = firebase.database();
		if (modeargs === "none") {
			let dbChnid = await db.ref("lobbySNH/" + chnid).once("value");
			dbChnid = dbChnid.val();
			if (dbChnid != null) {
				await message.channel.send("A game is already created in this channel.");
				return;
			}
			else {
				await message.channel.send("Creating game...");
				await db.ref("lobbySNH/" + chnid).set({
					"player1": p1+"N",
					"player2": p2+"N",
					"gameState": "inactive"
				});
				await message.channel.send("Game created.");
				// Delete the inactive game if it stays inactive after 5 minutes
				let schedule = require("node-schedule");
				schedule.scheduleJob(Date.now() + 300000, async function() {
					let state = await db.ref("lobbySNH/" + chnid + "/" + "gameState").once("value");
					state = state.val();
					if (state === "inactive") {
						await db.ref("lobbySNH/" + chnid).remove();
					}
					return;
				});
				return;
			}
		}
		else if (modeargs === "cancel") {
			let uid = message.author.id;
			let pid1 = await db.ref("lobbySNH/" + chnid + "/" + "player1").once("value");
			pid1 = pid1.val();
			if (pid1 === null) {
				await message.channel.send("This channel has no ongoing game.");
				return;
			}
			let pid2 = await db.ref("lobbySNH/" + chnid + "/" + "player2").once("value");
			pid2 = pid2.val();
			if (uid != pid1.slice(0, -1) && uid != pid2.slice(0, -1)) {
				await message.channel.send("You are not in a game in this channel.");
				return;
			}
			else {
				await db.ref("lobbySNH/" + chnid).remove();
				await message.channel.send("Game cancelled.");
				return;
			}
		}
		else if (modeargs === "ready") {
			let uid = message.author.id;
			let pid1 = await db.ref("lobbySNH/" + chnid + "/" + "player1").once("value");
			pid1 = pid1.val();
			if (pid1 === null) {
				await message.channel.send("This channel has no ongoing game.");
				return;
			}
			let pid2 = await db.ref("lobbySNH/" + chnid + "/" + "player2").once("value");
			pid2 = pid2.val();
			if (uid != pid1.slice(0, -1) && uid != pid2.slice(0, -1)) {
				await message.channel.send("You are not in a game in this channel.");
				return;
			}
			else {
				if (uid === pid1.slice(0, -1)) {
					if (pid1.slice(-1) === "Y") {
						await message.channel.send("You are already ready.");
						return;
					}
					else {
						await db.ref("lobbySNH/" + chnid).update({
							"player1": pid1.slice(0, -1)+"Y"
						});
						await message.channel.send("Player 1 ready.");
						if (pid2.slice(-1) === "Y") {
							let gameState = require("./snhGameStateGenerator.js");
							gameState = gameState.run();
							let modeargs = "startup";
							let command = require("../snh/snhGameCommandCenter.js");
							await db.ref("lobbySNH/" + chnid).update({
								"player1": pid1.slice(0, -1)+"N",
								"player2": pid2.slice(0, -1)+"N",
								"player1Score": 0,
								"player2Score": 0,
								"gameState": gameState
							});
							await message.channel.send("Game started.");
							command.run(Discord, config, firebase, client, message, "X", modeargs);
							return;
						}
						else {
							await message.channel.send("Please wait for Player 2.");
							return;
						}
					}
				}
				else if (uid === pid2.slice(0, -1)) {
					if (pid2.slice(-1) === "Y") {
						await message.channel.send("You are already ready.");
						return;
					}
					else {
						await db.ref("lobbySNH/" + chnid).update({
							"player2": pid2.slice(0, -1)+"Y"
						});
						await message.channel.send("Player 2 ready.");
						if (pid1.slice(-1) === "Y") {
							let gameState = require("./snhGameStateGenerator.js");
							gameState = gameState.run();
							let modeargs = "startup";
							let command = require("../snh/snhGameCommandCenter.js");
							await db.ref("lobbySNH/" + chnid).update({
								"player1": pid1.slice(0, -1)+"N",
								"player2": pid2.slice(0, -1)+"N",
								"player1Score": 0,
								"player2Score": 0,
								"gameState": gameState
							});
							await message.channel.send("Game started.");
							command.run(Discord, config, firebase, client, message, "X", modeargs);
							return;
						}
						else {
							await message.channel.send("Please wait for Player 1.");
							return;
						}
					}
				}
				else {
					message.channel.send("Impossible query detected. Shutting down bot.");
					console.log("The bot broke in rungameSNH player validation. Please report this issue to the bot creator.");
					return;
				}
				return;
			}
		}
	} catch (err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "snhLobby"
}