function LgGame(titre,maxPlayers,bot,msg) {

	this.titre = titre;
	this.createur = msg.author.id;
	this.maxPlayers = maxPlayers;
	this.bot = bot;
	this.msg = msg;
	this.state = "En attente de joueurs"; 
	this.players = [];

	this.makeChannel = function(){
	    var server = this.msg.guild;
		server.createChannel(this.titre, "text");
	}

	this.addPlayer = function(player){
		if(this.players.length < this.maxPlayers){
			this.players.push(player);
			return true;
		}else{
			return false;
		}
	}
};

module.exports = LgGame;