


exports.setup = {
	nom: "Villageois"
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