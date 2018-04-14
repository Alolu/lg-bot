const base = require("../Villageois/Villageois");

exports.setup = {
	nom: "Loup-garou",
	channel: "Taniere_des_loups",
	nightMessage: "Les loups se lêvent!",

	//Function ran before the start of a game
	start: function(channels,util){
		console.log("setup started Loup-garou")
		
		//Channel and role init
		channels[this.channel] = {
			["?"] : {
				nom: this.nom,
				permission: util.allow
			}
		}

		console.log("setup ended Loup-garou")

		return channels;
	},
	
	//Function ran every night during a game
	nuit: async function(game,sleep){
		var channel = game.channels.get();
	}
}

class LoupGarou extends base.Villageois {
	
	constructor(player){
		super(player)
		this.nom = "Loup-garou";
	}

	loupVote(role){
		if(role.nom != "Loup-garou"){
			role.loupVotes += 1;
			return true;
		}
		return false;
	}
}

exports.LoupGarou = LoupGarou;