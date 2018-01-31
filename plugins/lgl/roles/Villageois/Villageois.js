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
			var player = game.gameplayers.find(val => val.player.id === msg.author.id);
			console.log(msg.mentions.users.first().id)
		}catch(e){
			console.log(e);
		}
	}
}

class Villageois {

	constructor(player) {
    	this.player = player;
    	this.votes = 0;
		this.loupVotes = 0;
		this.etat = "vivant";
		this.nom = "Villageois";
    }
	
	vote(role){
		this.votefor = role;
		role.votes += 1 
  	}
  	meurt(role){
  		this.etat = "mort";
  	}
}

exports.Villageois = Villageois;