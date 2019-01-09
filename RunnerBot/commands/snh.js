module.exports.run = async (Discord, config, fs, firebase, client, message, args) => {
	try {
		if (typeof args[0] === "undefined" || args[0] === "help") {
			let embed = new Discord.RichEmbed()
				.setAuthor("RunnerBot")
				.setTitle("role")
				.setDescription(`The command for the actual SNH game itself.\n`);
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
// TODO UPDATE DESCRIPTION
// TODO FUNCTIONS
module.exports.help = {
	"name": "snh"
}
