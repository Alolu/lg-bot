function LgGame(titre,maxPlayers,bot,msg) {

	this.titre = titre;
	this.createur = msg.author.id;
	this.maxPlayers = maxPlayers;
	this.bot = bot;
	this.msg = msg;
	this.guild = msg.guild;
	this.state = "En attente de joueurs"; 
	this.players = [];

	this.makeChannel = function(){
	    var server = this.msg.guild;
		server.createChannel(this.titre, "text")
		.then((channel) => {
			this.channel = channel;
			var roles = this.guild.roles.array();
			for(var j = 0; j < roles.length; j++){
				this.channel.overwritePermissions(roles[j],{
					'ADMINISTRATOR' : 				false,			
					'CREATE_INSTANT_INVITE' : 		false,
					'KICK_MEMBERS' : 				false,
					'BAN_MEMBERS' : 				false,
					'MANAGE_CHANNELS' : 			false, 
					'MANAGE_GUILD' : 				false,
					'ADD_REACTIONS' : 				false,
					'VIEW_AUDIT_LOG' : 				false,
					'VIEW_CHANNEL' : 				false,
					'READ_MESSAGES' : 				false,
					'SEND_MESSAGES' : 				false,
					'SEND_TTS_MESSAGES' : 			false,
					'MANAGE_MESSAGES' : 			false,
					'EMBED_LINKS' : 				false,
					'ATTACH_FILES' : 				false,
					'READ_MESSAGE_HISTORY' : 		false,
					'MENTION_EVERYONE' : 			false,
					'USE_EXTERNAL_EMOJIS' : 		false,
					'EXTERNAL_EMOJIS' : 			false,
					'CONNECT' : 					false,
					'SPEAK' : 						false,
					'MUTE_MEMBERS' : 				false,
					'DEAFEN_MEMBERS' : 				false,
					'MOVE_MEMBERS' : 				false,
					'USE_VAD' : 					false,
					'CHANGE_NICKNAME' : 			false,
					'MANAGE_NICKNAMES' : 			false,
					'MANAGE_ROLES' : 				false,
					'MANAGE_ROLES_OR_PERMISSIONS' : false,
					'MANAGE_WEBHOOKS' : 			false,
					'MANAGE_EMOJIS' : 				false
				}).then(() => console.log('Done!'))
  				.catch(console.error);
			}
		})
		.catch(console.error);
	}

	this.addPlayer = function(player){
		if(this.players.length < this.maxPlayers){
			this.players.push(player);
			return true;
		}else{
			return false;
		}
	}

	this.checkPlayers = function(player){
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i] == player){
				return true;
			}
			return false;
		}
	}
};

module.exports = LgGame;