const Discord = require('discord.js');

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
			console.log("|__" + role_folders[i])
		}catch(err){
			console.log("bug role folder : "  + err)
		}
		if(role){
			delete require.cache[require.resolve(role_dir + role_folders[i])];
			if("setup" in role){
				roleList.set(role[role_folders[i]],role.setup);
			}

			if("commands" in role){
				for(var j = 0; j < role.commands.length; j++){
					if(role.commands[j] in role){
						lgl.addCommand(role.commands[j],role[role.commands[j]]);
						roleCount++;
					}
				}
				
			}
		}
	}
	return roleCount;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

var deny = {
  'ADMINISTRATOR' :         false,      
  'CREATE_INSTANT_INVITE' :     false,
  'KICK_MEMBERS' :        false,
  'BAN_MEMBERS' :         false,
  'MANAGE_CHANNELS' :       false, 
  'MANAGE_GUILD' :        false,
  'ADD_REACTIONS' :         false,
  'VIEW_AUDIT_LOG' :        false,
  'VIEW_CHANNEL' :        false,
  'READ_MESSAGES' :         false,
  'SEND_MESSAGES' :         false,
  'SEND_TTS_MESSAGES' :       false,
  'MANAGE_MESSAGES' :       false,
  'EMBED_LINKS' :         false,
  'ATTACH_FILES' :        false,
  'READ_MESSAGE_HISTORY' :    false,
  'MENTION_EVERYONE' :      false,
  'USE_EXTERNAL_EMOJIS' :     false,
  'EXTERNAL_EMOJIS' :       false,
  'CONNECT' :           false,
  'SPEAK' :             false,
  'MUTE_MEMBERS' :        false,
  'DEAFEN_MEMBERS' :        false,
  'MOVE_MEMBERS' :        false,
  'USE_VAD' :           false,
  'CHANGE_NICKNAME' :       false,
  'MANAGE_NICKNAMES' :      false,
  'MANAGE_ROLES' :        false,
  'MANAGE_ROLES_OR_PERMISSIONS' : false,
  'MANAGE_WEBHOOKS' :       false,
  'MANAGE_EMOJIS' :         false}
var allow = {
  'MENTION_EVERYONE' :      false,
  'MANAGE_MESSAGES' :       false,
  'ADMINISTRATOR' :         false,      
  'CREATE_INSTANT_INVITE' :     false,
  'KICK_MEMBERS' :        false,
  'BAN_MEMBERS' :         false,
  'MANAGE_CHANNELS' :       false, 
  'MANAGE_GUILD' :        false,
  'ADD_REACTIONS' :         true,
  'VIEW_AUDIT_LOG' :        false,
  'VIEW_CHANNEL' :        true,
  'READ_MESSAGES' :         true,
  'SEND_MESSAGES' :         true,
  'SEND_TTS_MESSAGES' :       true,
  'EMBED_LINKS' :         true,
  'ATTACH_FILES' :        true,
  'READ_MESSAGE_HISTORY' :    true,
  'USE_EXTERNAL_EMOJIS' :     true,
  'EXTERNAL_EMOJIS' :       true,
  'CONNECT' :           false,
  'SPEAK' :             false,
  'MUTE_MEMBERS' :        false,
  'DEAFEN_MEMBERS' :        false,
  'MOVE_MEMBERS' :        false,
  'USE_VAD' :           false,
  'CHANGE_NICKNAME' :       false,
  'MANAGE_NICKNAMES' :      false,
  'MANAGE_ROLES' :        false,
  'MANAGE_ROLES_OR_PERMISSIONS' : false,
  'MANAGE_WEBHOOKS' :       false,
  'MANAGE_EMOJIS' :         false}

var sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms*1000));
}


async function makePerms(channels,guild,callback){

  var channelList = new Discord.Collection();
  var roleList = new Discord.Collection();
  var everyoneRole = guild.roles.find("name","@everyone");

  for(channel in channels){
    var channelObject = await guild.createChannel(channel,"text");
    channelObject.overwritePermissions(everyoneRole,deny);
    channelList.set(channel,channelObject);
  }

  for(channel in channels){
    var channelTemplate = channels[channel]
    var channelObject = channelList.get(channel);
    for(role in channelTemplate){
      var roleObject = roleList.get(channelTemplate[role].nom)
      if(roleObject){
        channelObject.overwritePermissions(roleObject,channelTemplate[role].permission);
      }else{
        roleObject = await guild.createRole({ name: role });
        roleList.set(channelTemplate[role].nom,roleObject);
        channelObject.overwritePermissions(roleObject,channelTemplate[role].permission);
      }
    } 
  }

  if(callback){
    callback(channelList,roleList);
  }
}

module.exports = { makePerms }