const role = require("./LgRole");
delete require.cache[require.resolve("./LgRole")];

function LgGame(titre,maxPlayers,bot,msg,createur) {

	this.titre = titre;
	this.createur = createur;
	this.maxPlayers = maxPlayers;
	this.bot = bot;
	this.msg = msg;
	this.guild = msg.guild;
	this.state = "En attente de joueurs";
	this.compo = [];
	this.players = [];

	this.makeCompo = function(){
		this.compo.push(new role.Loup());
		for(var i = 1; i < this.maxPlayers; i++){
			this.compo.push(new role.Villageois());
		}
		console.log(this.compo)
	}
	this.makePerms = function(playerList){
	    var server = this.msg.guild;
	    server.createRole({
	    	name: "Joueur " + this.titre,
	    	color: "BLUE",
	    })
	    .then((role) => server.createChannel(this.titre, "text")
			.then((channel) => {
				this.channel = channel;
				this.role = role;
				this.addPlayer(this.createur,playerList);
				var roles = server.roles.array();
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
					}).then(() => console.log('ok'))
		  			.catch(console.error);	  	
				}
				this.channel.overwritePermissions(this.role,{
					'ADD_REACTIONS' : 				true,
					'VIEW_CHANNEL' : 				true,
					'READ_MESSAGES' : 				true,
					'SEND_MESSAGES' : 				true,
					'SEND_TTS_MESSAGES' : 			true,
					'EMBED_LINKS' : 				true,
					'ATTACH_FILES' : 				true,
					'READ_MESSAGE_HISTORY' : 		true,
					'USE_EXTERNAL_EMOJIS' : 		true,
					'EXTERNAL_EMOJIS' : 			true
				}).then(() => console.log('Done!'))
				.catch(console.error);

				console.log("lol",this.channel.permissionOverwrites);
			})
			.catch(console.error))
		.catch(console.error);

		
	}

	this.makeReady = function(player) {
		var rPlayer = this.checkPlayers(player);
		rPlayer.ready = !rPlayer.ready;
		if(rPlayer.ready){
			this.channel.send(rPlayer.player.toString() + " est prêt! " + this.role.toString());
		}else{
			this.channel.send(rPlayer.player.toString() + " n'est plus prêt! " + this.role.toString());
		}
	}

	this.addPlayer = function(player,playerList){
		if(this.players.length < this.maxPlayers){
			this.players.push({player: player, ready: false});
			player.addRole(this.role).then(() => console.log('Done!')).catch(console.error);
			playerList.set(player.id,this);
			return true;
		}else{
			return false;
		}
	}

	this.checkPlayers = function(player){
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i].player.id == player.id){
				return this.players[i];
			}
			return false;
		}
	}
};

module.exports = LgGame;