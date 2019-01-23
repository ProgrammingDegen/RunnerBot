module.exports.run = async (Discord, config, firebase, client, message, args) => {
	try {
		await message.channel.send("List of available commands:");
		let cmd = "";
		let cmdlist = "";
		let iterator = client.commands.keys();
		for (x = 0; x < client.commands.size; x++) {
			cmd = iterator.next().value;
			cmdlist += cmd;
			if (cmd != client.commands.lastKey()) {
				cmdlist += ", ";
			}
		}
		await message.channel.send(cmdlist);
		await message.channel.send(`Complex commands have a help page, try using "${config.prefix}[command] help"!`);
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "manpages"
}
