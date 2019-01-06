// Load up the discord.js library
const Discord = require("discord.js");
// Config.json file contains token and prefix value
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix
// File I/O
const fs = require("fs");

// Client and Guild
const client = new Discord.Client();
const guild = new Discord.Guild();

client.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
	if(err) console.error(err);
	// Filter for js files
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands.");
		return;
	}
	console.log(`Loading ${jsfiles.length} commands.`);
	jsfiles.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		client.commands.set(props.help.name, props);
	});
});

client.on("ready", async () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`on ${client.guilds.size} servers`);
  console.log(client.commands);
  // Feed bot invite link with full permissions to console 
  try {
	let link = await client.generateInvite(["ADMINISTRATOR"]);
	console.log(link);
  } catch(err) {
  	console.log(err.stack);
  }
});

client.on("guildCreate", guild => {
  // Event triggers when the bot joins a guild
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). Guild has ${guild.memberCount} members.`);
  client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // Event triggers when the bot is removed from a guild
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // Ignore bots
  if(message.author.bot) return;
  if(!message.content.startsWith(config.prefix)) return;

  // Separate command name and arguments
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  // Spaces are parsed by regex
  let args = message.content.slice(config.prefix.length).trim().split(" ");
  let command = args.shift().toLowerCase();
  console.log(args);
  console.log(command);

  command = client.commands.get(command);
  if(command) {
    command.run(Discord, config, fs, client, message, args);
  }
});

client.login(config.token);