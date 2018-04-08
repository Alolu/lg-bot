
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
 
var deny= 		{				'ADMINISTRATOR' : 				false,			
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
}

console.log(deny);