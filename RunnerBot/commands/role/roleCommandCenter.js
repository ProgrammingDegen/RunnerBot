module.exports.run = async (Discord, config, firebase, client, message, args, modeargs) => {
	// TODO Consider role initialization on role creations
	try {
		if (modeargs === "assign") {
			if (!message.member) {
				await message.channel.send("You are not in a channel.");
				return;
			}
			else if (!message.member.hasPermission("MANAGE_ROLES")) {
				await message.channel.send("You are not authorized to manage roles.");
				return;
			}
			else {
				// Check for valid mention, if valid goes through with role assignment
				const mentions = message.mentions.members;
				if (mentions.length <= 0 || mentions.length >= 2) {
					await message.channel.send("Invalid command signature.");
					return;
				}
				else if (!args[1].startsWith("<@") || !args[1].endsWith(">")) {
					await message.channel.send("Invalid command signature.");
					return;
				}
				else {
					const userToModify = mentions.first();
					let roleList = message.guild.roles;
					roleList = roleList.filter(role => role.name === args[2]);
					if (roleList.size === 0) {
						await message.channel.send("No such roles found.");
						return;
					}
					else if (roleList.size >= 2) {
						await message.channel.send("Two or more roles found with the same name. Please remove one of them.");
						return;
					}
					else {
						let role = roleList.first();
						await userToModify.addRole(role, `Through "${config.prefix}role assign".`);
						await message.channel.send("Role assigned successfully.");
						return;
					}
				}
				return;
			}
			return;
		}
		else if (modeargs === "unassign") {
			if (!message.member) {
				await message.channel.send("You are not in a channel.");
				return;
			}
			else if (!message.member.hasPermission("MANAGE_ROLES")) {
				await message.channel.send("You are not authorized to manage roles.");
				return;
			}
			else {
				// Check for valid mention, if valid goes through with role unassignment
				const mentions = message.mentions.members;
				if (mentions.length <= 0 || mentions.length >= 2) {
					await message.channel.send("Invalid command signature.");
					return;
				}
				else if (!args[1].startsWith("<@") || !args[1].endsWith(">")) {
					await message.channel.send("Invalid command signature.");
					return;
				}
				else {
					const userToModify = mentions.first();
					let roleList = message.guild.roles;
					roleList = roleList.filter(role => role.name === args[2]);
					if (roleList.size === 0) {
						await message.channel.send("No such roles found.");
						return;
					}
					else if (roleList.size >= 2) {
						await message.channel.send("Two or more roles found with the same name. Please remove one of them.");
						return;
					}
					else {
						let role = roleList.first();
						await userToModify.removeRole(role, `Through "${config.prefix}role unassign".`);
						await message.channel.send("Role assigned successfully.");
						return;
					}
				}
				return;
			}
			return;
		}
		else if (modeargs === "allow") {
			if (message.guild.id != config.host_server) {
				await message.channel.send("Function not available on this server.");
				return;
			}
			if (!message.member.hasPermission("MANAGE_ROLES")) {
				await message.channel.send("You are not authorized to manage roles.");
				return;
			}
			else {
				let roleList = message.guild.roles;
				roleList = roleList.filter(role => role.name === args[1]);
				if (roleList.size === 0) {
					await message.channel.send("No such roles found.");
					return;
				}
				else if (roleList.size >= 2) {
					await message.channel.send("Two or more roles found with the same name. Please remove one of them.");
					return;
				}
				else {
					let db = firebase.database();
					let dbFetch = await db.ref("roles/" + message.guild.id).once("value");
					dbFetch = dbFetch.val();
					// Initialize db if db doesn't exist
					if (dbFetch === null) {
						let roleListDB = message.guild.roles.keys();
						let roleDB = null;
						while (true) {
							roleDB = roleListDB.next().value;
							if (roleDB === undefined) {
								break;
							}
							else {
								await db.ref("roles/" + message.guild.id).update({
									[roleDB]: false
								});
							}
						}
					}
					let role = roleList.firstKey();
					await db.ref("roles/" + message.guild.id).update({
						[role]: true
					});
					await message.channel.send("Role modified successfully.");
					return;
				}
			}
			return;
		}
		else if (modeargs === "disallow") {
			if (message.guild.id != config.host_server) {
				await message.channel.send("Function not available on this server.");
				return;
			}
			if (!message.member.hasPermission("MANAGE_ROLES")) {
				await message.channel.send("You are not authorized to manage roles.");
				return;
			}
			else {
				let roleList = message.guild.roles;
				roleList = roleList.filter(role => role.name === args[1]);
				if (roleList.size === 0) {
					await message.channel.send("No such roles found.");
					return;
				}
				else if (roleList.size >= 2) {
					await message.channel.send("Two or more roles found with the same name. Please remove one of them.");
					return;
				}
				else {
					let db = firebase.database();
					let dbFetch = await db.ref("roles/" + message.guild.id).once("value");
					dbFetch = dbFetch.val();
					// Initialize db if db doesn't exist
					if (dbFetch === null) {
						let roleListDB = message.guild.roles.keys();
						let roleDB = null;
						while (true) {
							roleDB = roleListDB.next().value;
							if (roleDB === undefined) {
								break;
							}
							else {
								await db.ref("roles/" + message.guild.id).update({
									[roleDB]: false
								});
							}
						}
					}
					let role = roleList.firstKey();
					await db.ref("roles/" + message.guild.id).update({
						[role]: false
					});
					await message.channel.send("Role modified successfully.");
					return;
				}
			}
			return;
		}
		else if (modeargs === "join") {
			if (message.guild.id != config.host_server) {
				await message.channel.send("Function not available on this server.");
				return;
			}
			else {
				let roleList = message.guild.roles;
				roleList = roleList.filter(role => role.name === args[1]);
				if (roleList.size === 0) {
					await message.channel.send("No such roles found.");
					return;
				}
				else if (roleList.size >= 2) {
					await message.channel.send("Two or more roles found with the same name. Please remove one of them.");
					return;
				}
				else {
					let roleSnowflake = roleList.firstKey();
					let db = firebase.database();
					let dbFetch = await db.ref("roles/" + message.guild.id + "/" + roleSnowflake).once("value");
					dbFetch = dbFetch.val();
					if (dbFetch === null) {
						await message.channel.send("This role has not been initialized in the database. Please wait for manual initialization.");
						return;
					}
					else if (dbFetch === false) {
						await message.reply("This role cannot be self-assigned.");
						return;
					}
					else {
						roleList = message.guild.roles;
						let role = roleList.get(roleSnowflake);
						await message.member.addRole(role, `Through "${config.prefix}role join".`);
						await message.reply("Your role has been modified successfully.");
						return;
					}
				}
			}
			return;
		}
		else if (modeargs === "unjoin") {
			if (message.guild.id != config.host_server) {
				await message.channel.send("Function not available on this server.");
				return;
			}
			else {
				let roleList = message.guild.roles;
				roleList = roleList.filter(role => role.name === args[1]);
				if (roleList.size === 0) {
					await message.channel.send("No such roles found.");
					return;
				}
				else if (roleList.size >= 2) {
					await message.channel.send("Two or more roles found with the same name. Please remove one of them.");
					return;
				}
				else {
					let roleSnowflake = roleList.firstKey();
					let db = firebase.database();
					let dbFetch = await db.ref("roles/" + message.guild.id + "/" + roleSnowflake).once("value");
					dbFetch = dbFetch.val();
					if (dbFetch === null) {
						await message.channel.send("This role has not been initialized in the database. Please wait for manual initialization.");
						return;
					}
					else if (dbFetch === false) {
						await message.reply("This role cannot be self-assigned.");
						return;
					}
					else {
						roleList = message.guild.roles;
						let role = roleList.get(roleSnowflake);
						await message.member.removeRole(role, `Through "${config.prefix}role unjoin".`);
						await message.reply("Your role has been modified successfully.");
						return;
					}
				}
			}
			return;
		}
		return;
	} catch (err) {
		console.log(err.stack);
	}
}

module.exports.help = {
	"name": "roleCommandCenter"
}
