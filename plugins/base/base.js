exports.commands = [
	"bonne",
]

exports.bonne = {
	usage: "<un utilisateur>",
	description: "elle est bonne ma copine hein?",
	process: function(bot,msg,suffix){
		
		var args = suffix.split(" ");
		if(args.length > 1){
			msg.reply("Vous ne devez specifier qu'un seul utilisateur!");
			return false;
		}
		if(!suffix){
			msg.reply("Vous devez specifier un utilisateur!");
			return false;
		}
		mentionné = msg.mentions.users.first().toString();

		var phrase1 = "hé " + mentionné + " tu trouve pas qu'elle est bonne ma copine?";
		var phrase2 = "jsais pas si t'a vu " + mentionné + "mais ma copine elle est super bonne!";
		var phrase3 = "j'ai jamais vu une meuf aussi bonne que ma copine, t'es d'accord hein " + mentionné + "?";

		var phrases = [];

		phrases.push(phrase1,phrase2,phrase3);
		var phraseRandom = Math.floor(Math.random()*phrases.length);

		msg.channel.send(phrases[phraseRandom]);
	}
}