
const LgGame = require("./LgGame");
var games = [];

exports.commands = [
	"lgJoin",
	"lgCreate",
	"lgGames",
	"lgStatus"
]

exports.lgStatus = {
	usage : "<nom de la partie>",
	description: "voir le status d'une partie!",
	args: 1,
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
	args: 1,
	process: function(bot,msg,suffix){
		try{
			for(var i = 0; i < games.length; i++){
				var game = games[i];
				if(suffix == game.titre){
					if(game.addPlayer(msg.author.toString())){
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
	args : 2,
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