//TO REWORK

//Requirements
const Discord = require('discord.js');
const index = require('../../index');
const plugin = require('../../plugins');

//Global vars
var games = [];
var rolecommands = { };
var playerList = new Discord.Collection();
var roleList = new Discord.Collection()
var role_dir = './roles/';
var role_folders = plugin.getDirectories("./plugins/lgl/roles/");

//Global functions
function addCommand(commandName,commandObject){
	try {
		rolecommands[commandName] = commandObject;
	} catch(err){
		console.log(err);
	}
}
function load_roles(){
	var roleCount = 0;

	for(var i = 0; i < role_folders.length; i++){
		var role;
		try{
			role = require(role_dir + role_folders[i])
			console.log("|__" + role_folders[i])
		}catch(err){
			console.log("bug role folder : "  + err)
		}
		if(role){
			delete require.cache[require.resolve(role_dir + role_folders[i])];
			if("setup" in role){
				roleList.set(role[role_folders[i]],role.setup);
			}

			if("commands" in role){
				for(var j = 0; j < role.commands.length; j++){
					if(role.commands[j] in role){
						addCommand(role.commands[j],role[role.commands[j]]);
						roleCount++;
					}
				}
				
			}
		}
	}
	return roleCount;
}

//Modules loading + exports
load_roles();
exports.roleList = roleList;

//Requirement after role processing
const LgGame = require("./LgGame");
delete require.cache[require.resolve("./LgGame")];


//Commands
exports.commands = [
	"lgJoin",
	"lgCreate",
	"lgGames",
	"lgStatus",
	"lgCancel",
	"lgReady",
	"lgAct",
	"lgCompo"
]

exports.lgAct = {
	usage: "<action>",
	description: "Effectue l'action d'un personnage en partie",
	args: [{type: "string", optional: false},{type:"all", optional: true, endless: 1}],
	process: function(bot,msg,suffix){
		try{
			var cmd;
			console.log("Checking for action");
			if (suffix.constructor == Array){
				cmd = rolecommands[suffix[0]]
				suffix.splice(0,1);
			}else{
				cmd = rolecommands[suffix]
			}
			if(cmd){
				console.log("Action found!");
				var game = playerList.get(msg.author.id);
				if(cmd.args){
					var args = suffix;
					var errMsg = "\n" + cmd.usage + "\n" + cmd.description;
					var gameplayer;

					if(!game){
						msg.reply("\nVous devez etre dans une partie pour utiliser lgAct!");
						return false;
					}
					if(cmd.role){
						for(var i = 0; i < cmd.role.length; i++){
							console.log("checking player role");
							var playerCheck = game.gameplayers.find("nom",cmd.role[i]);
							if(playerCheck){
								if(playerCheck.player.id == msg.author.id){
									gameplayer = true; 
								}
							}
						}
						if(!gameplayer){
							msg.reply("\nCette action n'est pas disponible pour votre role!");
							return false;
						}

					}

					if(index.checkArgs(cmd.args,args,msg,errMsg)){
						if(args.length == 1){
							cmd.process(bot,msg,args[0],game);
						}else{
							cmd.process(bot,msg,args,game);
						}
					}
				}else{
					cmd.process(bot,msg,suffix,game);
				}
			}else{
				msg.channel.send("Ceci n'est pas une commande!")
			}
		}catch(e){
			console.log(e.stack);
		}
	}
}

exports.lgCancel = {
	usage: "<nom de la partie>",
	description: "Supprimer une partie en attente",
	args: [{type: "string", optional: false}],
	process: function(bot,msg,suffix){
		try{
			console.log("deleting game");
			for(var i = 0; i < games.length; i++){
				var game = games[i];
				if(suffix == game.titre){
					if(msg.author.id != game.createur.id){
						msg.reply("Seul le createur de la partie peux supprimer cette partie!")
						return false;
					}

					game.players.forEach(function(player){
						playerList.delete(player.id);
					});
					game.category.delete().then(console.log("Category deleted!")).catch(console.error);
					game.channels.forEach(function(channel){
						channel.delete().then(console.log("Channel deleted!")).catch(console.error);
					})
					game.roles.forEach(function(role){
						role.delete().then(console.log("Role deleted!")).catch(console.error);
					})
					
					
					if(game.state == "En cours"){
						if(game.timeRemainingInterval){
							clearInterval(game.timeRemainingInterval);
						}
						game.state = "Fermeture";
					}
					games.splice(i,1);
					console.log("game deleted");
					msg.reply("La partie " + game.titre + " à été supprimée.");
					return true;
				}
			}
			msg.reply("Il n'y a aucune partie de ce nom!");
		}catch(e){
			console.log(e.stack);
		}
	}
}

exports.lgStatus = {
	usage : "<nom de la partie>",
	description: "voir le statut d'une partie",
	args: [{type: "string", optional: false}],
	process: function(bot,msg,suffix){
		try{
			for(var i = 0; i < games.length; i++){
				var game = games[i];
				if(suffix == game.titre){
					var batch;
					batch = "\nEtat de la partie : " + game.state + ".";
					batch += "\nJoueurs : ";
					for(var j = 0; j < game.players.length; j++){
						var player = game.players[j];
						batch += "\n" + player.toString();
					}
					batch += "\nComposition de la partie : "; 
					game.compo.forEach(function(role){
						batch += role.nom + ", ";
					});
				}
				msg.reply(batch.substr(0,batch.length-2) + ".");
				return true;
			}
			msg.reply("\nIl n'y a aucune partie de ce nom!");
		}catch(e){
			console.log(e.stack);
		}
	}
}

exports.lgJoin = {
	usage : "<nom de la partie>",
	description: "Rejoindre une partie de loup-garou",
	args: [{type: "string", optional: false}],
	process: function(bot,msg,suffix){
		try{
			for(var i = 0; i < games.length; i++){
				var game = games[i];
				var player = msg.author;
				if(suffix == game.titre){
					if(game.checkPlayers(player)){
						msg.reply("Vous êtes deja dans cette partie !");
						return false;
					}
					if(game.addPlayer(msg.member,playerList)){
						msg.reply("Vous avez rejoint la partie " + game.titre);
						return true;
					}else{
						msg.reply("Il n'y a plus assez de place dans cette partie");
						return false;
					}
				}
			}
			msg.reply("Il n'y a pas de partie à ce nom!");
		}catch(e){
			console.log(e.stack);
		}
	}
}

exports.lgCreate = {
	usage : "<nom de la partie> <nombre de joueur>",
	description: "Creer une partie de loup-garou",
	args : [
				{type: "string", optional: false},
				{type: "number", optional: false}
			],
	process: function(bot,msg,suffix){


		var game = new LgGame(suffix[0],suffix[1],bot,msg,msg.member);
		try{
			games.push(game);
			game.makeCompo();
			game.makePerms(playerList);
			console.log("game created")
		}catch(e){
			console.log(e.stack);
		}
	}
}

exports.lgGames = {
	usage: "",
	description : "montre les parties de loup-garou",
	process: function(bot,msg,suffix){
		try{
			var info = "";
			if(games.length > 0){
				for(var i = 0; i < games.length; i++){
					var game = games[i];
					if(game.players.length == game.maxPlayers){
						info += "\nsalon complet " + game.titre + " " + game.players.length + "/" + game.maxPlayers + " joueurs dans le salon";
					}else{
						info += "\nsalon incomplet " + game.titre + " " + game.players.length + "/" + game.maxPlayers + " joueurs dans le salon";
					}
				}
			}else{
				info += "\nIl n'y aucune partie en cours pour le moment";
			}
			console.log(playerList);
			msg.reply(info);
		}catch(e){
			console.log(e.stack);
		}
	}
}

exports.lgReady = {
	usage: "",
	description : "passe de l'etat attente a pret, ou de l'etat pret a attente",
	process: function(bot,msg,suffix){
		try{
			var game = playerList.get(msg.author.id);
			if(game){
				game.makeReady(msg.author);
				console.log("player ready");
				return true;
			}
			msg.reply("Vous n'avez rejoint aucune partie");
		}catch(e){
			console.log(e.stack);
		}
	}
}

exports.lgCompo = {
	usage: "<role> <nombre>",
	description: "Change la composition de la partie",
	args:[
		{type: "string"},
		{type: "all", endless: 1, optional:"true"}
	],
	process: function(bot,msg,suffix){
		try{
			var game = playerList.get(msg.author.id);
			if(!game){
				msg.reply('Vous n\'avez aucune partie en cours!');
				return false;
			}
			if(game.createur != msg.member){
				msg.reply('Vous n\'êtes pas le createur de cette partie!');
				return false;
			}
			if(suffix == "clear"){
				game.compo = [];
			}
			if(suffix[0] == "add"){
				suffix.splice(0,1);
				var errMsg;
				var args = [
					{type: "string"},
					{type: "number", endless: 2, optional:"true"}
				]
				if(index.checkArgs(args,suffix,msg,errMsg)){
					console.log(suffix)
					if(suffix.length%2 == 0){
						var total = game.compo.length;
						for(i=1; i<suffix.length; i+=2){
							total += parseInt(suffix[i]);
							console.log(total);
							if(total > game.maxPlayers){
								msg.reply("Trop de roles");
								return false;
							}
						}
						for(i=0; i<suffix.length; i+=2){
							if(roleList.find('nom',suffix[i])){
								for(v = 0; v < suffix[i+1]; v++){
									game.compo.push(roleList.find('nom',suffix[i]));
								}
							}else{
								msg.reply("Ce role n'existe pas");
								return false;
							}
						}
						msg.reply("Roles ajoutés!");
						return true;
					}else{
						msg.reply("Precisez le nombre a ajouter!");
						return false;
					}
				}	
			}
			msg.reply("no");
		}
		catch(e){
			console.log(e.stack);
		}
	}
}