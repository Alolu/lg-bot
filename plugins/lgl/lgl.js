const Discord = require('discord.js');
const LgGame = require("./LgGame");
delete require.cache[require.resolve("./LgGame")];
var games = [];
var playerList = new Discord.Collection();

function compareUser(user,server){
	var gm = server.members.array();
	for(var i = 0; i < gm.length; i++){
		if(gm[i].id == user.id){
			return gm[i];
		}
	}
}

exports.commands = [
	"lgJoin",
	"lgCreate",
	"lgGames",
	"lgStatus",
	"lgCancel",
	"lgReady"
]

exports.lgCancel = {
	usage: "<nom de la partie>",
	description: "Supprimer une partie en attente",
	args: [{type: "string", optional: false}],
	process: function(bot,msg,suffix){
		try{
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
					game.channel.delete().then(console.log("Channel deleted!")).catch(console.error);
					game.role.delete().then(console.log("Role deleted!")).catch(console.error);
					games.splice(i,1);
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
						batch += role + ", ";
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
					if(game.addPlayer(compareUser(player,msg.guild),playerList)){
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


		var game = new LgGame(suffix[0],suffix[1],bot,msg,compareUser(msg.author,msg.guild));
		try{
			games.push(game);
			game.makeCompo();
			game.makePerms(playerList);
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
				return true;
			}
			msg.reply("Vous n'avez rejoint aucune partie");
		}catch(e){
			console.log(e.stack);
		}
	}
}
