const Discord = require('discord.js');
const util = require('../../util');
delete require.cache[require.resolve('../../util')];

var lgl = require('./lgl');
delete require.cache[require.resolve('./lgl')];

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

var sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms*1000));
}

function LgGame(titre,maxPlayers,bot,msg,createur) {

	this.titre = titre;
	this.createur = createur;
	this.maxPlayers = maxPlayers;
	this.bot = bot;
	this.msg = msg;
	this.guild = msg.guild;
	this.state = "En attente";
	this.roles = new Discord.Collection();
	this.channels = new Discord.Collection();
	this.compo = [];
	this.players = [];
	this.ordre = [];
	this.gameplayers = new Discord.Collection();

	this.makeCompo = function(){

	}

	this.makePerms = function(playerList){

		var that = this;

		var channels = {
		    Village : {
		      	["joueur " + this.titre]: {
		      		nom: "base",
		        	permission: util.allow
		      	},
		      	mort:{
		      		nom: "mort",
		        	permission: util.read
		      	}
		    },
		    Cimetiere:{
		      	mort:{
		      		nom: "mort",
		        	permission: util.allow
		      	}
		    }
		}

		util.makePerms(channels,this.guild,async function(channels,roles){
			that.category = await that.guild.createChannel(that.titre, "category");
			that.roles = roles;
			that.channels = channels;
			for(var i = 0; i < channels.array().length; i++){
				channels.array()[i].setParent(that.category);
			}
			that.addPlayer(that.createur,playerList);
		})
	}

	this.makeChannel = function(nom,thisrole,callback){
		var roles = this.guild.roles.array();
		var promises = [];
		var specialchannel;
		var specialrole;
		Promise.properRace([this.guild.createChannel(nom,"text"),this.guild.createRole({ name: "?", color: "RED" })],2)
		.then((results) => {
			for(var i = 0; i < results.length; i++){
	    			if(results[i].constructor.name == "TextChannel"){
	    				specialchannel  = results[i];
	    			}else if(results[i].constructor.name == "Role"){
	    				specialrole = results[i];
	    			}
	    		}

	    		callback(specialrole,specialchannel);

	    		var specialgameplayers = this.gameplayers.findAll('nom',thisrole);

	    		for(var v = 0; v < specialgameplayers.length; v++){
	    			specialgameplayers[v].player.addRole(specialrole);
	    		}

	    		for(var j = 0; j < roles.length; j++){
	    			promises.push(specialchannel.overwritePermissions(roles[j],deny))
	    		}
	    		promises.push(specialchannel.overwritePermissions(specialrole,allow))
				promises.push(specialchannel.setParent(this.category))

				Promise.properRace(promises,promises.length)
	    			.then((results2) => console.log(thisrole + "'s channel done"))
	    			.catch(console.error);
		})
		.catch(console.error)
	}

	this.prerun = function(){
		shuffle(this.players);
		for(var i = 0; i < this.players.length; i++){
			var role = lgl.roleList.findKey('nom',this.compo[i].nom)
			this.gameplayers.set(this.compo[i],new role(this.players[i]));
			this.players[i].send("Votre role est " + this.compo[i].nom);
			this.ordre.push(this.compo[i]);
		}
		var channels = {};
		for(var j = 0; j < this.ordre.length; j++){
			this.ordre[j].start(channels,util);
		}
		var that = this;
		console.log(channels);
		util.makePerms(channels,this.guild,function(channels,roles){
			that.roles = that.roles.concat(roles);
			that.channels = that.channels.concat(channels);
			for(var i = 0; i < channels.array().length; i++){
				channels.array()[i].setParent(that.category);
			}
		})
		this.run();
	}

	this.voteCheck = function(){
		var votes = [];
		var highestVote = Math.max.apply(Math,this.gameplayers.array().map(function(o){return o.votes;}))
		var highestVoted = this.gameplayers.find("votes",highestVote);
		highestVoted.meurt(this);
	}

	this.run = async function(){
		var channel = this.channels.get("Village");
		this.state = "En cours"
		while(this.state == "En cours"){

			this.time = "day";

			channel.send("Tout le monde se leve...")
			this.displayTime(10);
			await sleep(12);
			this.voteCheck();

			this.time = "night";

			channel.send("tout le monde s'endors...")
			for(var i = 0; i < this.ordre.length; i++){
				if(this.ordre[i].nuit){
					this.ordre[i].nuit(this);
					this.displayTime(10);
					await sleep(12);
				}
			}		
		}
	}

	this.displayTime = function(time){
		var that = this;
		this.timeRemainingInterval = setInterval(function(){
			that.category.setName("🐺   " + that.titre + " " + time + "   🐺");
			time -= 1;
			if(time < 0){
				clearInterval(that.timeRemainingInterval);
			}
		},1000);
	}

	this.makeReady = function(player) {
		var rPlayer = this.checkPlayers(player);
		var channel = this.channels.get("Village");
		var role = this.roles.get("base");
		rPlayer.ready = !rPlayer.ready;
		if(rPlayer.ready){
			channel.send(rPlayer.toString() + " est prêt! " + role.toString());
			if(this.players.length == this.maxPlayers){
				if(this.checkReady()){
					channel.send("Tout le monde est prêt, la partie va bientôt commencer! " + role.toString());
					this.prerun();
				}
			}
		}else{
			channel.send(rPlayer.toString() + " n'est plus prêt! " + role.toString());
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
			player.addRole(this.roles.get("base")).then(() => console.log('role added to player')).catch(console.error);
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