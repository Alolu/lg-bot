var fs = require('fs'),
	path = require('path');
function getDirectories(srcpath){
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath,file)).isDirectory();
	});
}

var plugin_dir = "./plugins/";
var plugin_folders = getDirectories(plugin_dir);

exports.init = function(){
	return load_plugins();
}

function load_plugins(){
	var bot = require('./index');
	var commandCount = 0;

	for(var i = 0; i < plugin_folders.length; i++){
		var plugin;
		try{
			plugin = require(plugin_dir + plugin_folders[i])
		}catch(err){
			console.log("bug plugins folder "  + err)
		}
		if(plugin){
			delete require.cache[require.resolve(plugin_dir + plugin_folders[i])];
			if("commands" in plugin){
				for(var j = 0; j < plugin.commands.length; j++){
					if(plugin.commands[j] in plugin){
						bot.addCommand(plugin.commands[j],plugin[plugin.commands[j]]);
						commandCount++;
					}
				}
			}
		}
	}
	return commandCount;
}