// Load up the discord.js library
const Discord = require("discord.js");
// Config.json file contains token and prefix value
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix
// File I/O
const fs = require("fs");
const client = new Discord.Client();
const guild = new Discord.Guild();
// Load firebase
const firebase = require("firebase");
// Initialize Firebase
// firebaseconfig.json contains firebase config data
const firebaseConfig = require("./firebaseconfig.json");
firebase.initializeApp(firebaseConfig);
// Get command list for command handler
client.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
	if(err) console.error(err);
	// Filter for js files
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands.");
		return;
	}
	console.log(`Loading ${jsfiles.length} command(s).`);
	jsfiles.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		client.commands.set(props.help.name, props);
	});
});

client.on("ready", async () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`on ${client.guilds.size} server(s)`);
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
  client.user.setActivity(`on ${client.guilds.size} server(s)`);
});

client.on("guildDelete", guild => {
  // Event triggers when the bot is removed from a guild
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`on ${client.guilds.size} server(s)`);
});


client.on("message", async message => {
  // Ignore bots
  if(message.author.bot) return;
  if(!message.content.startsWith(config.prefix)) return;
  console.log(message.createdTimestamp);

  // Separate command name and arguments
  // EX: -perform Tesselate Trionis
  // command = perform
  // args = ["Tesselate", "Trionis"]
  let args = message.content.slice(config.prefix.length).trim().split(" ");
  let command = args.shift().toLowerCase();
  console.log(args);
  console.log(command);

  command = client.commands.get(command);
  if(command) {
    command.run(Discord, config, firebase, client, message, args);
  }
});

client.login(config.token);