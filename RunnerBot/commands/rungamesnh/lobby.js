module.exports.run = async (Discord, config, fs, firebase, client, message, p1, p2, modeargs) => {
	let chnid = message.channel.toString();
	chnid = chnid.slice(2, -1);
	try {
		let db = firebase.database();
		if (modeargs === "none") {
			let dbChnid = await db.ref("lobby/" + chnid).once("value");
			dbChnid = dbChnid.val();
			if (dbChnid != null) {
				await message.channel.send("A game is already created in this channel.");
				return;
			}
			else {
				await message.channel.send("Creating game...");
				await db.ref("lobby/" + chnid).set({
					"player1": p1+"N",
					"player2": p2+"N",
					"gameState": "inactive",
					"time": message.createdTimestamp + 300
				});
				await message.channel.send("Game created.");
				return;
			}
		}
		else if (modeargs === "cancel") {
			let uid = message.author.id;
			let pid1 = await db.ref("lobby/" + chnid + "/" + "player1").once("value");
			pid1 = pid1.val();
			if (pid1 === null) {
				await message.channel.send("This channel has no ongoing game.");
				return;
			}
			let pid2 = await db.ref("lobby/" + chnid + "/" + "player2").once("value");
			pid2 = pid2.val();
			if (uid != pid1.slice(0, -1) && uid != pid2.slice(0, -1)) {
				await message.channel.send("You are not in a game in this channel.");
				return;
			}
			else {
				await db.ref("lobby/" + chnid).remove();
				await message.channel.send("Game cancelled.");
				return;
			}
		}
		else if (modeargs === "ready") {
			let uid = message.author.id;
			let pid1 = await db.ref("lobby/" + chnid + "/" + "player1").once("value");
			pid1 = pid1.val();
			if (pid1 === null) {
				await message.channel.send("This channel has no ongoing game.");
				return;
			}
			let pid2 = await db.ref("lobby/" + chnid + "/" + "player2").once("value");
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
						let dbUpdate = {};
						dbUpdate["lobby/" + chnid + "/" + "player1"] = pid1.slice(0, -1)+"Y";
						await db.ref().update(dbUpdate);
						await message.channel.send("Player 1 ready.");
						if (pid2.slice(-1) === "Y") {
							let gameState = require("./gameStateGenerator.js");
							gameState = gameState.run();
							dbUpdate = {};
							dbUpdate["lobby/" + chnid + "/" + "gameState"] = gameState;
							await db.ref().update(dbUpdate);
							await db.ref(chnid).set({
								"player1": pid1.slice(0, -1)+"N",
								"player2": pid2.slice(0, -1)+"N",
								"player1Score": 0,
								"player2Score": 0,
								"gameState": null,
								"time": message.createdTimestamp + 300
							});
							await message.channel.send("Game started.");
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
						let dbUpdate = {};
						dbUpdate["lobby/" + chnid + "/" + "player2"] = pid2.slice(0, -1)+"Y";
						await db.ref().update(dbUpdate);
						await message.channel.send("Player 2 ready.");
						if (pid1.slice(-1) === "Y") {
							let gameState = require("./gameStateGenerator.js");
							gameState = gameState.run();
							dbUpdate = {};
							dbUpdate["lobby/" + chnid + "/" + "gameState"] = gameState;
							await db.ref().update(dbUpdate);
							await db.ref(chnid).set({
								"player1": pid1.slice(0, -1)+"N",
								"player2": pid2.slice(0, -1)+"N",
								"player1Score": 0,
								"player2Score": 0,
								"gameState": null,
								"time": message.createdTimestamp + 300
							});
							await message.channel.send("Game started.");
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
					console.log("The bot broke in rungamesnh player validation. Please report this issue to the bot creator.");
					return;
				}
				return;
			}
		}
	} catch (err) {
		console.log(err.stack);
	}
}
// TODO testing for P2 + 2 player states commands
module.exports.help = {
	"name": "lobby"
}