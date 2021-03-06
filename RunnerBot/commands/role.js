module.exports.run = async (Discord, config, firebase, client, message, args) => {
	// TODO EVERYTHING
	try {
		if (typeof args[0] === "undefined" || args[0] === "help") {
			let embed = new Discord.RichEmbed()
				.setAuthor(`${config.bot_name}`, `${config.bot_avatar_url}`)
				.setTitle("role")
				.setDescription("This function is currently only available on TTC. If you are not on TTC, please refer to the TTC trials at: [link].\n"+
					"Usage (Case-sensitive):\n"+
					`"${config.prefix}role allow XXX": Set role XXX as self-assignable.\n`+
					`"${config.prefix}role disallow XXX": Set role XXX as no longer self-assignable.\n`+
					`"${config.prefix}role assign @XXX YYY": Manually assign XXX role YYY.\n`+
					`"${config.prefix}role unassign @XXX YYY": Manually unassign XXX role YYY.\n`+
					`"${config.prefix}role join XXX": Join self-assignable role XXX.\n`+
					`"${config.prefix}role unjoin XXX": Leave self-assignable role XXX.`)
				.setThumbnail(`${config.bot_avatar_url}`);
			await message.channel.send(embed);
			return;
		}
		if (args.length > 2) {
			return;
		}
		else {
			return;
		}
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "role"
}
