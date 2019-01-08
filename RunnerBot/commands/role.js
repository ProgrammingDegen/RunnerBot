module.exports.run = async (Discord, config, fs, firebase, client, message, args) => {
	try {
		if (typeof args[0] === "undefined" || args[0] === "help") {
			let embed = new Discord.RichEmbed()
				.setAuthor("RunnerBot")
				.setTitle("role")
				.setDescription(`[I promise to mark up everything later]\n`);
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
// TODO EVERYTHING
module.exports.help = {
	"name": "role"
}
