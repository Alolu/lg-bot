Villageois = require("../Villageois/Villageois")

exports.LoupGarou
exports.setup = {
	random: "shit";
}

class LoupGarou extends Villageois {
	
	constructor(player){
		super(player)
		this.nom = "Loup-garou";
	}

	loupVote(role){
		if(role.nom != "Loup-garou"){
			role.loupVotes += 1
			return true;
		}
		return false;
	}
	meurt(role){
  		this.etat = "mort";
  	}
}

