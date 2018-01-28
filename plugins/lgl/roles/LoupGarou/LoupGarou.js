const base = require("../Villageois/Villageois");


exports.setup = {
	nom: "Loup-garou"
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
	meurt(role){
  		this.etat = "mort";
  	}
}

exports.LoupGarou = LoupGarou;