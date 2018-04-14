exports.setup = {
	nom: "Villageois",

	start: function(gameplayers){
		console.log("no setup Villageois")
	}
}

exports.commands = [
	"vote"
]

exports.vote = {
	usage: "<joueur>",
	description: "Vote pour tuer le joueur mentionné",
	args: [{type: "mention", optional: false}],
	process: function(bot,msg,suffix,game){
		try	{
			if(game.time != "day"){
				msg.reply("Vous ne pouvez voter que le jour!");
				return false;
			}
			var playerRole = game.gameplayers.find(val => val.player.id === msg.author.id);
			var votedPlayerRole = game.gameplayers.find(val => val.player.id === msg.mentions.users.first().id);

			playerRole.vote(votedPlayerRole);
			msg.channel.send(playerRole.player.toString() + " à voté pour " + votedPlayerRole.player.toString());
		}catch(e){
			console.log(e);
		}
	}
}

class Villageois {

	constructor(player) {
    	this.player = player;
    	this.nickname = player.displayName;
    	this.votes = 0;
		this.loupVotes = 0;
		this.etat = "vivant";
		this.nom = "Villageois";
    }
	
	vote(role){
		this.votefor = role.player.id;
		role.votes += 1;
		role.player.setNickname(role.nickname + " (" + role.votes + ")");
	  }
	  
  	meurt(game){
  		this.etat = "mort";
  		this.player.addRole(game.roles.get("mort"));
  		this.player.removeRole(game.roles.get("base"));
  	}
}

exports.Villageois = Villageois;