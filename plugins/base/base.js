exports.commands = [
	"test",
	"test2"
]

exports.test = {
	usage: "<arg1>",
	description: "fonction test",
	process: function(bot,msg,suffix){
		msg.reply("test")
	}
}
exports.test2 = {
	usage: "<arg1> <arg2>",
	description: "fonction test 2",
	process: function(bot,msg,suffix){
		msg.reply("test2")
	}
}