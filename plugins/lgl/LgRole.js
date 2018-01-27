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
  		this.etat = "mort"
  	}
}


class Loup extends Villageois {
	
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

module.exports = {Villageois: Villageois, Loup: Loup};