const Discord = require('discord.js')
const bot = new Discord.Client()

var commands = { }

bot.login('NDA1MDE1MTEyOTc4NzkyNDU4.DUeU_w.IyHsxPeHSCspM7Rp_6ZBpItBDT4')

var commandPrefix = ";"

bot.on("ready", function () {
	require("./plugins.js").init();
	bot.user.setActivity(commandPrefix+"help for help");
})

function checkForCommands(msg){

	if(msg.author.id != bot.user.id && (msg.content.startsWith(commandPrefix))){
		var cmdTxt = msg.content.split(" ")[0].substr(commandPrefix.length);
		var suffix = msg.content.substr(cmdTxt.length+commandPrefix.length+1);
		if(msg.isMentioned(bot.user)){
			try{
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substr(bot.user.mention().length+cmdTxt.length+commandPrefix.length+1);
			}catch(e){
				msg.reply("oUi???");
				return;
			}
		}
		var cmd = commands[cmdTxt];
		if(cmdTxt === "help"){
			if(suffix){
				var cmdHelp = commands[suffix];
				if(cmdHelp){
					msg.reply("\n" + commandPrefix + suffix + " : " + cmdHelp.usage + "\n" + cmdHelp.description);
				}else{
					msg.reply("Commande inconnue, verifier la syntaxe, tapez ;help pour une liste des commandes");
				}
			}else{
				var batch = "";
				var sortedCommands = Object.keys(commands).sort();
				for(var i in sortedCommands){
					var info = ""
					var cmd = sortedCommands[i];
					info += "\n" + commandPrefix + cmd + " : " + commands[cmd].usage + "\n" + commands[cmd].description;
					var newBatch = batch + info;
					if(newBatch.length > (1024 - 8)){
						msg.author.send(batch);
						batch = info;
					}else{
						batch = newBatch;
					}
				}
				if(batch.length > 0){
					msg.author.send(batch);
				}
			}
		}else if(cmd){
			try{
				if(cmd.args){
					var args = suffix.split(" ");
					var errMsg = "\n";
					var good = true;
					if(args.length > cmd.args){
						errMsg += "Il y'a trop d'arguments!"
					}
					if(!suffix || args.length < cmd.args){
						errMsg += "Il manque des arguments!"
					}
					console.log(msg.mentions.users);
					if(cmd.type == "mention" && msg.mentions.users.array().length == 0 && suffix && args.length == cmd.args){
							errMsg += "Vous devez mentionner un utilisateur!";
							good = false;
					}
					console.log(args.length + "/" + cmd.args );
					if(suffix && args.length == cmd.args && good){
						if(args.length == 1){
							cmd.process(bot,msg,args[0]);
						}else{
							cmd.process(bot,msg,args);
						}
					}else{
						errMsg += "\n" + cmd.usage + "\n" + cmd.description;
						msg.reply(errMsg);
					}					
				}else{
					cmd.process(bot,msg,suffix);
				}
			}catch(e){
				msg.channel.send(e);
			}
		}else{
			msg.channel.send("Ceci n'est pas une commande!")
		}
	}else{
		if(msg.author == bot.user) {
			return;
		}
		if (msg.author != bot.user && msg.isMentioned(bot.user)) {
                msg.channel.send("OuiUI?"); 
        }
	}
}

bot.on("message", (msg) => checkForCommands(msg));

exports.addCommand = function(commandName,commandObject){
	try {
		commands[commandName] = commandObject;
	} catch(err){
		console.log(err);
	}
}

