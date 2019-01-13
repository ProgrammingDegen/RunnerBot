module.exports.run = async (Discord, config, firebase, client, message, args) => {
    // Command removes all messages from all users in the channel, up to 100 
    // Get the delete count, as an actual number (Base 10)
    const deleteCount = parseInt(args[0], 10);
    try {
        if (message.channel.type === "dm") {
           await message.channel.send("Cannot do this in DMs.");
           return;
        }
    	if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
    		try {
    			await message.reply("Please provide a number between 2 and 100 for the number of messages to delete.");
    			return;
    		} catch(err) {
    			console.log(err.stack);
    		}
      	}
    	let fetched = await message.channel.fetchMessages({limit: deleteCount});
    	message.channel.bulkDelete(fetched).catch(error => console.log(`Couldn't delete messages because of: ${error}`));
	} catch(err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "purge"
}
