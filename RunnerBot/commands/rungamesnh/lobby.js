module.exports.run = async (Discord, config, fs, firebase, client, message, p1, p2, modeargs) => {
	let chnid = message.channel.toString();
	chnid = chnid.slice(2, -1);
	try {
		let db = firebase.database();
		if (modeargs === "none") {
			await db.ref("lobby/" + chnid).set( {
				"player1": p1+"N",
				"player2": p2+"N",
				"gameState": "inactive",
				"time": message.createdTimestamp + 300
			});
			await message.channel.send("Game created.");
			return;
		}
		else if (modeargs === "cancel") {
			let uid = message.author.id;
			let pid1 = await db.ref("lobby/" + chnid + "/" + "player1").once("value");
			pid1 = pid1.val().slice(0, -1);
			let pid2 = await db.ref("lobby/" + chnid + "/" + "player1").once("value");
			pid2 = pid2.val().slice(0, -1);
			if (uid != pid1 && uid != pid2) {
				await message.channel.send("You are not in a game.");
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
			pid1 = pid1.val().slice(0, -1);
			let pid2 = await db.ref("lobby/" + chnid + "/" + "player1").once("value");
			pid2 = pid2.val().slice(0, -1);
			if (uid != pid1 && uid != pid2) {
				await message.channel.send("You are not in a game.");
				return;
			}
			else {
				if (uid === pid1) {
					await db.ref("lobby/" + chnid + "/" + "player1").update(pid1+"Y");
					await message.channel.send("Player 1 ready.");
				}
				else if (uid === pid2) {
					await db.ref("lobby/" + chnid + "/" + "player2").update(pid2+"Y");
					await message.channel.send("Player 2 ready.");
				}
				return;
			}
		}
	} catch (err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "lobby"
}