const base = require("../Villageois/Villageois");

exports.setup = {
	nom: "Loup-garou",
	start: function(channels,util){
		console.log("setup started Loup-garou")
		
		channels["Taniere_des_loups"] = {
			["?"] : {
				nom: this.nom,
				permission: util.allow
			}
		}

		console.log("setup ended Loup-garou")

		return channels;
	},

	nuit: async function(game,sleep){
		var channel = game.channels.get("Taniere_des_loups");
		channel.send("Les loups se levent");
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