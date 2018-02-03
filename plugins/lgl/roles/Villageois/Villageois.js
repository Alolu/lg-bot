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
			var votedplayer = game.gameplayers.find(val => val.player.id === msg.mentions.users.first().id);
			player.vote(votedplayer);
			console.log(votedplayer.votes, "voted player vote");
			console.log(player.votefor);
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
  	meurt(role){
  		this.etat = "mort";
  	}
}

exports.Villageois = Villageois;