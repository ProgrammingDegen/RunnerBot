module.exports.run = async (Discord, config, firebase, client, message, args) => {
	try {
		await message.channel.send(`Please go to ${config.prefix}manpages instead for the command list.`);
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "help"
}
