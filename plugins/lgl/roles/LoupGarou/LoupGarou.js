const base = require("../Villageois/Villageois");

exports.setup = {
	nom: "Loup-garou",
	start: function(game){
		console.log("setup started Loup-garou")
		console.log(this.nom,"this.nom");
		game.makeChannel("Taniere_des_loups",this.nom,function(role,channel){
			game.loupchannel = channel
			game.louprole = role
		});
		console.log("setup ended Loup-garou")
	},
	nuit: async function(game,sleep){
		game.loupchannel.send("Les loups se levent");
		game.displayTime(10);
	},
	end: function(game){
		game.loupchannel.delete().then(console.log("Channel deleted!")).catch(console.error);
		game.louprole.delete().then(console.log("Role deleted!")).catch(console.error);
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
	meurt(role){
  		this.etat = "mort";
  	}
}

exports.LoupGarou = LoupGarou;