exports.commands = [
	"bonne",
]

exports.bonne = {
	usage: "<un utilisateur>",
	description: "elle est bonne ma copine hein?",
	args: 1,
	type: "mention",
	process: function(bot,msg,suffix){
		
		mentionné = msg.mentions.users.first().toString();

		var phrase1 = "hé " + mentionné + " tu trouve pas qu'elle est bonne ma copine?";
		var phrase2 = "jsais pas si t'a vu " + mentionné + "mais ma copine elle est super bonne!";
		var phrase3 = "j'ai jamais vu une meuf aussi bonne que ma copine, t'es d'accord hein " + mentionné + "?";
		var phrase4 = "salut " + mentionné + ", c'est juste pour te dire que ma copine c'est la meuf la plus bonne sur terre";

		var phrases = [];

		phrases.push(phrase1,phrase2,phrase3);
		var phraseRandom = Math.floor(Math.random()*phrases.length);

		msg.channel.send(phrases[phraseRandom]);
	}
}