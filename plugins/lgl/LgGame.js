const Discord = require('discord.js');
const plugin = require('../../plugins');
var roleList = new Discord.Collection()
var deny = {
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
	'MANAGE_EMOJIS' : 				false}
var allow = {
	'MENTION_EVERYONE' : 			false,
	'MANAGE_MESSAGES' : 			false,
	'ADMINISTRATOR' : 				false,			
	'CREATE_INSTANT_INVITE' : 		false,
	'KICK_MEMBERS' : 				false,
	'BAN_MEMBERS' : 				false,
	'MANAGE_CHANNELS' : 			false, 
	'MANAGE_GUILD' : 				false,
	'ADD_REACTIONS' : 				true,
	'VIEW_AUDIT_LOG' : 				false,
	'VIEW_CHANNEL' : 				true,
	'READ_MESSAGES' : 				true,
	'SEND_MESSAGES' : 				true,
	'SEND_TTS_MESSAGES' : 			true,
	'EMBED_LINKS' : 				true,
	'ATTACH_FILES' : 				true,
	'READ_MESSAGE_HISTORY' : 		true,
	'USE_EXTERNAL_EMOJIS' : 		true,
	'EXTERNAL_EMOJIS' : 			true,
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
	'MANAGE_EMOJIS' : 				false}
var role_dir = './plugins/lgl/roles/';
var role_folders = plugin.getDirectories(role_dir);

Promise.properRace = function(promises, count = 1, results = []) {
  promises = Array.from(promises);
  if (promises.length < count) {
    return Promise.reject('Race is not finishable');
  }
   
  // There is no way to know which promise is resolved/rejected.
  // So we map it to a new promise to return the index wether it fails or succeeeds.
  let indexPromises = promises.map((p, index) => p.then(() => index, () => {throw index;}));
   
  return Promise.race(indexPromises).then(index => {
    // The promise has resolved, remove it from the list of promises, and add it 
    // to the list of results
    let p = promises.splice(index, 1)[0];
    p.then(e => results.push(e));
    if (count === 1) {
      // The race has finished now, return the results
      return results;
    }
    // Continue the race, but now we expect one less winner because we have found one
    return Promise.properRace(promises, count-1, results);
  }, index => {
    // The promise has rejected, remove it from the list of promises and just 
    // continue the race without changing the count.
    promises.splice(index, 1);
    return Promise.properRace(promises, count, results);
  });
};

function load_roles(){
	var roleCount = 0;

	for(var i = 0; i < role_folders.length; i++){
		var role;
		try{
			role = require(role_dir + role_folders[i])
		}catch(err){
			console.log("bug role folder "  + err)
		}
		if(role){
			delete require.cache[require.resolve(plugin_dir + role_folders[i])];
			if("setup" in role){
				roleList.set(role.setup,role[role_folders[i]]);
			}
		}
	}
	console.log(roleCount,roleList);
	return roleCount;
}

load_roles();

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
		this.compo.push("osef");
		for(var i = 1; i < this.maxPlayers; i++){
			this.compo.push("osef");
		}
	}

	this.makePerms = function(playerList){
	    var server = this.msg.guild;
	    var roles = server.roles.array();

	    Promise.properRace(
	    [server.createChannel(this.titre, "category"),
	    server.createChannel(this.titre,"text"),
	    server.createRole({ name: "Joueur " + this.titre, color: "BLUE" })]
	    , 3)
	    	.then((results) => {
	    		var promises = [];
	    		

	    		for(var i = 0; i < results.length; i++){
	    			if(results[i].constructor.name == "CategoryChannel"){
	    				this.category = results[i];
	    			}else if(results[i].constructor.name == "TextChannel"){
	    				this.channel  = results[i];
	    			}else if(results[i].constructor.name == "Role"){
	    				this.role = results[i];
	    			}
	    		}

	    		this.addPlayer(this.createur,playerList);

	    		for(var j = 0; j < roles.length; j++){
	    			promises.push(this.channel.overwritePermissions(roles[j],deny))
	    			promises.push(this.category.overwritePermissions(roles[j],deny))
	    		}
	    		promises.push(this.category.overwritePermissions(this.role,allow))
	    		promises.push(this.channel.overwritePermissions(this.role,allow))
				promises.push(this.channel.setParent(this.category))

	    		Promise.properRace(promises,roles.length)
	    			.then((results2) => console.log("done"))
	    			.catch(console.error);
	    	})
	    	.catch(console.error);
	}

	this.run = function(){

	}

	this.makeReady = function(player) {
		var rPlayer = this.checkPlayers(player);
		rPlayer.ready = !rPlayer.ready;
		if(rPlayer.ready){
			this.channel.send(rPlayer.toString() + " est prêt! " + this.role.toString());
			console.log(this.players.length,this.maxPlayers)
			if(this.players.length == this.maxPlayers){
				if(this.checkReady()){
					this.channel.send("Tout le monde est prêt, la partie va bientôt commencer! " + this.role.toString());
					this.run();
				}
			}
		}else{
			this.channel.send(rPlayer.toString() + " n'est plus prêt! " + this.role.toString());
		}
	}

	this.checkReady = function(){
		for(var i = 0; i < this.players.length; i++){
			if(!this.players[i].ready){
				return false;
			}
		}
		return true;
	}

	this.addPlayer = function(player,playerList){
		if(this.players.length < this.maxPlayers){
			player.ready = false;
			this.players.push(player);
			player.addRole(this.role).then(() => console.log('Done!')).catch(console.error);
			this.category.setName("🐺   " + this.titre + " " + this.players.length + "/" + this.maxPlayers + "   🐺");
			playerList.set(player.id,this);
			return true;
		}else{
			return false;
		}
	}

	this.checkPlayers = function(player){
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i].id == player.id){
				return this.players[i];
			}
		}
		return false;
	}
};

module.exports = LgGame;