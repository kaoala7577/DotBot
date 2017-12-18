//this shit

const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
var config = require("./config/config.json");

//embed helper function - courtesy of Adelyn (love u so much)

function checkArgs(types, vals) {
		for (var i=0; i<types.length; i++) {
	        if (vals[i] === null) {
	            continue;
	        }
			if (typeof types[i] === 'object') {
				var t1 = true;
				if (typeof vals[i] !== types[i][0]) {
					t1 = false;
				}
				if (t1 === false) {
					if (typeof vals[i] !== types[i][1]) {
						return [false,types[i],i,typeof vals[i]];
					}
				}
			} else {
				if (typeof vals[i] !== types[i]) {
					return [false,types[i],i,typeof vals[i]];
				}
			}
		}
		return [true,'',vals.length];
	}
	
	function makeEmbed(title, desc, color, author, footer, thumbnail, fields, timestamp) {
	    var res = checkArgs(['string', 'string', 'number', ['object', 'string'], ['object', 'string'], 'string', 'object', ['object', 'boolean']], [title, desc, color, author, footer, thumbnail, fields, timestamp]);
	    if (res[0]) {
	        var embed = new Discord.RichEmbed();
	        if (title !== null) embed.setTitle(title);
	        if (desc !== null) embed.setDescription(desc);
	        if (color !== null) embed.setColor(color);
	        if (author !== null) {
				if (typeof author === 'string') {
					embed.setAuthor(author);
				} else {
					embed.setAuthor(author[0], author[1] || undefined, author[2] || undefined);
				}
			}
			if (footer !== null) {
				if (typeof footer === 'string') {
					embed.setFooter(footer);
				} else {
					embed.setFooter(footer[0], footer[1] || undefined, footer[2] || undefined);
				}
			}
	        if (thumbnail !== null) embed.setThumbnail(thumbnail);
			if (fields !== null) {
				for (var i=0; i<fields.length; i++) {
					if (typeof fields[i][0] === 'string' && (typeof fields[i][1] === 'string' || typeof fields[i][1] === 'object') && (typeof fields[i][2] === 'boolean' || typeof fields[i][2] === 'undefined')) {
						embed.addField(fields[i][0], fields[i][1], fields[i][2]);
					}
				}
			}
	        if (timestamp !== null) {
				if (timestamp === true) {
					embed.setTimestamp();
				} else if (typeof timestamp === 'object') {
					embed.setTimestamp(timestamp);
				}
			}
	        return embed;
	    } else {
	        return new Discord.RichEmbed().setDescription("Failed to make embed. Args didn't check out.\nExpected: "+res[1]+"\nIndex: "+res[2]+"\nGot: "+res[3]);
	    }
	}



//startup

bot.on('ready', () => {
	console.log('Logged in as ' + bot.user.username + "#" + bot.user.discriminator);
	bot.user.setGame(config.prefix + "help");
});

/*all commands:
help
info
ping
prefixcheck
prefixset
purge
warn
kick
ban
userinfo
serverinfo
fill*/

//beginning

bot.on("message", (message) => {
	if(message.author.bot) return;

//help command (dm)

	if(message.content.startsWith(config.prefix + "help")) {
		message.channel.send("I've DMed you the help page!");
		message.author.send("```dsconfig\nHow To Read```\n`<>` = you **must** add this argument\n`[]` = this argument is **optional**\n`|` = do this **or** this (`a | b = a or b`)\n**Name:** - Description - `Example`\n\n```dsconfig\nCommands```\n**Ping:** - Shows the current ping - `" + config.prefix + "ping`\n\n**Info:** - Shows the bot info - `"  + config.prefix + "info`\n**UserInfo:** - Shows the info of a user - `" + config.prefix + "userinfo <user> | " + config.prefix + "ui <user>`\n**ServerInfo:** - Shows the info of the server - `" + config.prefix + "serverinfo | " + config.prefix + "si`\n\n**Prefix Check:** - Shows the command prefix in case you forget - `" + bot.user.tag + " prefixcheck`\n**Prefix Set:** - Sets a new prefix. Must be Bot Owner - `" + config.prefix + "prefixset <new prefix>`\n\n**Purge:** - Bulk deletes messages. Must have 'mod' role - `" + config.prefix + "purge <amount> [user]`\n**Warn:** - Warn a member about their actions. Must have 'staff' role - `" + config.prefix + "warn <user> <reason>`\n**Kick:** - Kicks a user. Must have 'mod' role - `" + config.prefix + "kick <user> [reason]`\n**Ban:** - Bans a member. Must have 'admin' role - `" + config.prefix + "ban <user> [reason]`");
		console.log("'Help' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ")");
			//make sure to edit this when you add a new command
	}

//info command

	if(message.content.startsWith(config.prefix + "info")) {
		let embed = makeEmbed(
			"Bot Info", // Title
			bot.user.username + " is a moderation bot created specifically for the SAGA Sandwiches server! It uses the [Javascript](https://www.javascript.com/) scripting language using the [Discord.js](https://discord.js.org/#/) library", // Description
			0x0f7fa6, // Colour
			null, // Author
			null, // Footer
			"https://cdn.discordapp.com/attachments/387700865642790914/388780092437823498/invert_circle.png", // Thumbail
			[["Guilds", bot.guilds.size.toString(), true], //Start Fields, field 1
			["Owner", config.ownerTag, true], // field 2
			["Support Server", "[DotBot Testing Server](https://discord.gg/qN5zj9F)", true], //field 3
			["Invite", "[Invite link](https://discordapp.com/api/oauth2/authorize?client_id=387590403114926080&permissions=8&scope=bot)", true]],
			true
		);
		message.channel.send({embed});
	
		console.log("'Info' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ")");
	}

//ping command

	if(message.content.startsWith(config.prefix + "ping")) {
		message.channel.send("Pong!").then(rsp => {
			rsp.edit("Pong! Your ping is `" + (rsp.createdTimestamp - message.createdTimestamp) + " ms`");
			console.log("'Ping' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ")");
		});
	}

//prefix check command

	if(message.content.startsWith(config.prefixMention + "prefixcheck")) {
		message.channel.send("The prefix is `" + (config.prefix) + "`. If you have the correct permissions and you would like to change it, do `" + config.prefix + "prefixset <new prefix>`");
		console.log("'Prefixcheck' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ")");
	}

		//ROLE ONLY NOW

//prefix set command, courtesy of Adelyn

	if(message.content.startsWith(config.prefix + "prefixset")) {
		if(message.author.id !== config.ownerID) {
			return message.channel.send("You don't have the permissions to do that"),
			console.log("'PrefixSet' was executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ") but failed to complete");
		}
		config.prefix = message.content.split(" ").slice(1, 2)[0];
		fs.writeFile("./config/config.json", JSON.stringify(config), (err) => console.error);
			message.channel.send("Prefix set to `" + (config.prefix) + "`");
			console.log("'PrefixSet' was executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ")");
	}

//purge command

	if(message.content.startsWith(config.prefix + "purge")) {

		let user = message.mentions.users.first();
		let amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2]);
		let log = message.guild.channels.find("name", "logs");
		let modRole = message.guild.roles.find("name", "mod");
		if(modRole && !message.member.roles.has(modRole.id)) {
			message.channel.send("You don't have the permissions to do that")
			console.log("'Purge' was executed in the guild " + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ") but failed to complete");
			return;
		}
		let embed = makeEmbed(
			null,
			"**Moderator: **" + message.author.tag + " (" + message.author.id + ")\n**Amount:** " + amount + "\n**Channel: ** <#" + message.channel.id + ">",
			0x0f7fa6,
			"Messages have been purged",
			["MID: " + message.author.id, message.guild.iconURL],
			message.author.avatarURL,
			null,
			true
		);

		if (isNaN(amount)) return message.channel.send('Must specify an amount to delete!');
		if (!amount && !user) return;
		message.channel.fetchMessages({
			limit: amount + 1,
		}).then((messages) => {
			if (user) {
				let filterBy = user ? user.id : bot.user.id;
				messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
			}
			message.channel.bulkDelete(messages).catch(error => message.channel.send(error.stack));
			console.log("'Purge' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + "). They have deleted " + amount + " messages");
			if (log) log.send({embed});
		}).catch(console.error);
	}

	//warn command

	if(message.content.startsWith(config.prefix + "warn")) {

		let user = message.mentions.users.first();
		let args = message.content.slice(config.prefix.length).trim().split(/\s+/g);
		let reason = args.slice(2).join(" ");
		let staffRole = message.guild.roles.find("name", "staff");
		if(staffRole && !message.member.roles.has(staffRole.id)) {
			message.channel.send("You don't have the permissions to do that")
			console.log("'Warn' was executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ") but failed to complete");
			return;
		}
		reason = reason === "" ? "None given" : reason

		if(message.mentions.users.size < 1) return message.channel.send("You must mention a user to warn");

		let embed = makeEmbed(
			null,
			"**You have broken the rules. Do not do this again.**\n**Warn reason:** " + reason,
			0x0f7fa6,
			"You have broken a rule in " + message.guild.name,
			[user.id, user.displayAvatarURL],
			message.guild.iconURL,
			null,
			true
		)

		user.send({embed});
		message.channel.send(user.tag + " has been warned");
		console.log("'Warn' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + "). They warned " + user.tag + " for the following: " + reason);
	}

	//kick command

	if(message.content.startsWith(config.prefix + "kick")) {
		let args = message.content.slice(config.prefix.length).trim().split(/\s+/g);
		let user = message.mentions.members.first();
		let reason = args.slice(2).join(" ");
		let log = message.guild.channels.find("name", "logs");
		let modRole = message.guild.roles.find("name", "mod");
		if(modRole && !message.member.roles.has(modRole.id)) {
			message.channel.send("You don't have the permissions to do that")
			console.log("'Kick' was executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ") but failed to complete");
			return;
		}
		let embed = makeEmbed(
			null,
			"**Member:** " + user.tag + " (" + user.id + ")\n**Reason:** " + reason,
			0x0f7fa6,
			"Member has been kicked from the server",
			["ID: " + user.id, user.displayAvatarURL],
			user.displayAvatarURL,
			null,
			true
		)

		if(message.mentions.users.size < 1) return message.channel.send("You must mention a user to kick");
		if(!message.guild.member(user).kickable) return message.channel.send("I can't kick someone that has a role higher than me");
		message.guild.member(user).kick(reason);
		if (log) log.send({embed});
		console.log("'Kick' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + "). They kicked " + user + " for the following: " + reason);
	  }

	  //ban command

	  if(message.content.startsWith(config.prefix + "ban")) {

		let args = message.content.slice(config.prefix.length).trim().split(/\s+/g);
		let user = message.mentions.members.first()
		let reason = args.slice(2).join(" ");
		let log = message.guild.channels.find("name", "logs");
		let adminRole = message.guild.roles.find("name", "admin");
		if(adminRole && !message.member.roles.has(adminRole.id)) {
			message.channel.send("You don't have the permissions to do that")
			console.log("'Ban' was executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ") but failed to complete");
			return;
		}

		let embed = makeEmbed(
			null,
			"**Member:** " + user.tag + " (" + user.id + ")\n**Reason:** " + reason,
			0x0f7fa6,
			"Member has been banned from the server",
			["ID: " + user.id, user.displayAvatarURL],
			user.displayAvatarURL,
			null,
			true
		)

		if(message.mentions.users.size < 1) return message.channel.send("You must mention a user to ban");
		if(!message.guild.member(user).bannable) return message.channel.send("I can't ban someone that has a role higher than me");
		message.guild.member(user).ban(reason);
		if (log) log.send({embed});
		console.log("'Ban' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + "). They banned " + user + " for the following: " + reason);
	  }

	  //userinfo command

	  if(message.content.startsWith(config.prefix + "userinfo") || message.content.startsWith(config.prefix + "ui")) {

		let usera = message.mentions.users.first();
		if(!usera) return message.channel.send("Must specify user");
		if(message.mentions.users.size > 1) return message.channel.send("Please only mention one user");
		let member = message.guild.members.find("id", usera.id);
		let verifiedRole = member.roles.find(val => val.name === 'verified');
		let gameName = usera.presence.game ? usera.presence.game.name : "None";

		let embed = makeEmbed(
			null,
			null,
			0x0f7fa6,
			[usera.tag, usera.avatarURL],
			null,
			usera.avatarURL,
			[["ID", usera.id, true],
			["Username", usera.username, true],
			["Status", usera.presence.status, true],
			["Game", gameName, true],
			["Joined Server", member.joinedAt, true],
			["Created", usera.createdAt, true],
			["Bot", usera.bot ? "Yes" : "No", true],
			["Verified", verifiedRole ? "Yes" : "No", true]],
			true
		)
		message.channel.send({embed});

		console.log("'UI' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ")");
	}

	//server info -- created with help from Mishio595
	if(message.content.startsWith(config.prefix + "serverinfo") || message.content.startsWith(config.prefix + "si")) {
		let memberCount = message.guild.members.size;
		let bots = 0, humans = 0;
		message.guild.members.forEach(function(mem) {
			if (mem.user.bot) {
				bots += 1;
			} else {
				humans += 1;
			}
		});

		let verifiedRole = message.guild.roles.find("name", "verified");
		var vCount = 0;
		message.guild.members.forEach(function(mem) {
			if (mem.roles.get(verifiedRole.id)) {
				vCount += 1;
			}
		});
		let channels = message.guild.channels.size;
		let textCh = 0, voiceCh = 0, categories = 0;
		message.guild.channels.forEach(function(chan) {
			if (chan.type === "text") {
				textCh += 1;
			} else if (chan.type === "voice") {
				voiceCh += 1;
			}
		});

		let embed = makeEmbed(
			null,
			null,
			0x0f7fa6,
			[message.guild.name, message.guild.iconURL],
			null,
			message.guild.iconURL,
			[["ID", message.guild.id, true],
			["Name", message.guild.name, true],
			["Owner", "<@" + message.guild.owner.id + ">", true],
			["Region", message.guild.region, true],
			["Created", message.guild.createdAt, true],
			["Channels (" + channels + ")", "**Text:** " + textCh + "\n**Voice:** " + voiceCh, true],
			["Members (" + memberCount + ")", "**Human:** " + humans + "\n**Bot:** " + bots + "\n**Verified:** " + vCount, true]],
			true
		)
		message.channel.send({embed});

		console.log("'SI' has been executed in the guild '" + message.guild.name + "' by " + message.author.tag + " (" + message.author.id + ")");
	}
});

//Outputs that don't have message triggers

//welcome message + log message
bot.on('guildMemberAdd', member => {
	let general = member.guild.channels.find("name", "welcome");
	let log = member.guild.channels.find("name", "logs");
	let welcome = member.guild.channels.find("name", "welcome-rules") ? member.guild.channels.find("name", "welcome-rules").id : 0

	let welcomeEmbed = makeEmbed(
		null,
		"Welcome, " + "<@" + member.id + ">" + "! Please read through <#" + welcome + "> and inform a staff member (by using the !staff command) of your sexuality, gender and pronouns for further instruction!",
		0x0f7fa6,
		[member.user.tag + " has joined " + member.guild.name + "!", member.user.displayAvatarURL],
		["MID: " + member.id, member.guild.iconURL],
		member.user.displayAvatarURL,
		null,
		true
	)

	let logEmbed = makeEmbed(
		null,
		"<@" + member.id + "> has joined the guild. Go welcome them!",
		0x0f7fa6,
		[member.user.tag + " joined", member.user.displayAvatarURL],
		["MID: " + member.id, member.guild.iconURL],
		member.user.displayAvatarURL,
		null,
		true
	)

	if(general) general.send(welcomeEmbed);
	if(log) log.send(logEmbed);

	console.log(member.user.tag + " (" + member.user.id + ") joined " + member.guild.name);
});

//goodbye message + log message
bot.on('guildMemberRemove', member => {
	let general = member.guild.channels.find("name", "general");
	let welcome = member.guild.channels.find("name", "welcome");
	let verifiedRole = member.guild.roles.find("name", "verified");
	let log = member.guild.channels.find("name", "logs");

	let goodbyeEmbed = makeEmbed(
		null,
		"Goodbye, <@" + member.id + ">! I hope you enjoyed your time on the server!",
		0x0f7fa6,
		[member.user.tag + " left", member.user.displayAvatarURL],
		["MID " + member.id, member.guild.iconURL],
		member.user.displayAvatarURL,
		null,
		true
	)
	let logEmbed = makeEmbed(
		null,
		"<@" + member.id + "> has left the guild.",
		0x0f7fa6,
		[member.user.tag + " left", member.user.displayAvatarURL],
		["MID: " + member.id, member.guild.iconURL],
		member.user.displayAvatarURL,
		null,
		true
	)

	if(verifiedRole && member.roles.has(verifiedRole.id)) {
		if(general) general.send({goodbyeEmbed});
		if (log) log.send(logEmbed);
		return;
	}
	if(verifiedRole && !member.roles.has(verifiedRole.id)) {
		if(welcome) welcome.send(goodbyeEmbed);
		if(log) log.send(logEmbed);
		return;
	}

	console.log(member.user.tag + " (" + member.user.id + ") left " + member.guild.name);
});

//log message when bot is added to a new guild
bot.on('guildCreate', guild => {
	let logChannel = bot.channels.get(config.logInTestGuild);
	if (logChannel) logChannel.send("**" + bot.user.username +"** has been added to the guild **" + guild.name + "**");
	console.log(bot.user.username + " has been added to the guild " + guild.name);
});

//log message when bot is removed from a guild
bot.on('guildDelete', guild => {
	let logChannel = bot.channels.get(config.logInTestGuild);
	if (logChannel) logChannel.send("**" + bot.user.username +"** has been removed from the guild **" + guild.name + "**");
	console.log(bot.user.username + " has been removed from the guild " + guild.name);
});

//delete message log
bot.on('messageDelete', message => {
	let logChannel = message.guild.channels.find("name", "logs");
	let deleteEmbed = makeEmbed(
		null,
		"**Member:** " + message.author.tag + " (" + message.author.id + ")\n**Content:** " + message.content + "\n**Channel:** <#" + message.channel.id + ">",
		0x0f7fa6,
		"Message deleted",
		["MSGID: " + message.id, message.guild.iconURL],
		message.author.displayAvatarURL,
		null,
		true
	)

	if(message) {
		logChannel.send({embed : deleteEmbed});
		console.log("'" + message.content + "' was deleted in " + message.guild.name + " (message sent by " + message.author.tag + ")");
	}
});

bot.login(config.token);
