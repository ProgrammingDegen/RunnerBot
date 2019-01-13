module.exports.run = async (Discord, config, firebase, client, message, args) => {
	// TODO EVERYTHING
	try {
		if (typeof args[0] === "undefined" || args[0] === "help") {
			let embed = new Discord.RichEmbed()
				.setAuthor(`${config.bot_name}`, `${config.bot_avatar_url}`)
				.setTitle("role")
				.setDescription(`[I promise to mark up everything later]\n`)
				.setThumbnail(`${config.bot_avatar_url}`);
			await message.channel.send(embed);
			return;
		}
		if (args.length > 1) {
			return;
		}
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "role"
}
