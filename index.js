const Discord = require('discord.js')
const bot = new Discord.Client()
const Mention = Discord.MessageMentions
const config = require("./config")
const plugins = require("./plugins")

delete require.cache[require.resolve("./plugins")];

var commands = { }

bot.login(config.botId);

var commandPrefix = "$"

bot.on("ready", function () {
	console.log("Adding plugins");
	plugins.init();
	bot.user.setActivity(commandPrefix+"help for Help");
	console.log("On!");
})

function checkArgs(argsList,args,msg,errMsg){
	try{
		console.log("Checking arguments")
		var duration;
		var endless = false;
		if(args.length<argsList.length){
			duration = argsList.length;
		}else{
			duration = args.length;
		}
		for(var i = 0; i < duration; i++){
			var arg = args[i];
			var argPattern = argsList[i];
			var n = (i+1);

			// check if the previous pattern was an endless type
			if(endless){
				argPattern = argsList[i - endless];
			}

			console.log(argPattern,arg,i + " " + endless);

			if(argPattern == null && arg){
				msg.reply("\nIl y'a trop de parametres!" + errMsg)
				return false;
			}
			//if pattern is endless assign current i to endless var
			if(argPattern.endless && endless){
				endless += argPattern.endless;
			}
			if(argPattern.endless && !endless){
				endless = argPattern.endless;
			}
			if(!argPattern.optional && !arg){
				msg.reply("\nIl n'y a pas assez de parametres!" + errMsg)
				return false;
			}
			if(argPattern.optional && !arg){
				return true;
			}
			if(argPattern.type == "number" && isNaN(arg)){
				msg.reply("\nle parametre numero " + n +" doit être un numero!" + errMsg)
				return false;
			}
			if(argPattern.type == "string" && arg.match(Mention.USERS_PATTERN)){
				msg.reply("\nle parametre numero " + n + " doit être une chaine de caractere! (Pas de mention)" + errMsg)
				return false;
			}
			if(argPattern.type == "mention" && !arg.match(Mention.USERS_PATTERN)){
				msg.reply("\nle parametre numero " + n + " doit être une mention!" + errMsg)
				return false;
			}
		}
		return true;
	}catch(e){
		console.log(e.stack);
		return false;
	}
}

function checkForCommands(msg){

	if(msg.author.id != bot.user.id && (msg.content.startsWith(commandPrefix))){
		console.log("Checking for commands");
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
		}else if(cmdTxt === "reload"){
			commands = { }
			var commandCount = plugins.init();
			msg.reply("\n" + commandCount + " commandes actualisées!")
		}else if(cmd){
			console.log("command found!")
			try{
				if(cmd.args){
					var args = suffix.split(" ");
					var errMsg = "\n" + cmd.usage + "\n" + cmd.description;
					if(checkArgs(cmd.args,args,msg,errMsg)){
						if(args.length == 1){
							cmd.process(bot,msg,args[0]);
						}else{
							cmd.process(bot,msg,args);
						}
					}
					/*
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
					*/

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

bot.on("message", (msg) => {
	checkForCommands(msg)
});

function addCommand(commandName,commandObject){
	try {
		commands[commandName] = commandObject;
	} catch(err){
		console.log(err);
	}
}

module.exports = { checkArgs,addCommand };