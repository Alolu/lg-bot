
const LgGame = require("./LgGame");
var games = [];

exports.commands = [
	"lgJoin",
	"lgCreate",
	"lgGames",
	"lgStatus",
	"lgCancel"
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
					if(msg.author.id != game.createur){
						msg.reply("Seul le createur de la partie peux supprimer cette partie!")
						return false;
					}
					
					games.splice(i,1);
					msg.reply("La partie " + game.titre + " à été supprimée.");
					return true;
				}
				msg.reply("Il n'y a aucune partie de ce nom!");
			}
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
						batch += "\n" + player;
					}
				}
			}
			msg.reply(batch);
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
				var player = msg.author.toString();
				if(suffix == game.titre){
					if(game.checkPlayers(player)){
						msg.reply("Vous êtes deja dans cette partie !");
						return false;
					}
					if(game.addPlayer(player)){
						msg.reply("Vous avez rejoint la partie " + game.titre);
					}else{
						msg.reply("Il n'y a plus assez de place dans cette partie");
					}
				}
			}
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


		var game = new LgGame(suffix[0],suffix[1],bot,msg);
		try{
			games.push(game);
			game.makeChannel();
			game.addPlayer(msg.author.toString());
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
			msg.reply(info);
		}catch(e){
			console.log(e.stack);
		}
	}
}