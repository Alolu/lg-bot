const util = require('../../util');
delete require.cache[require.resolve('../../util')];

exports.commands = [
	"bonne",
]

exports.bonne = {
	usage: "<un utilisateur>",
	description: "elle est bonne ma copine hein?",
	args: [{type: "mention", optional: false}],
	process: function(bot,msg,suffix){
		
		mentionné = msg.mentions.users.first().toString();

		var phrases = [];
		phrases.push(
			 "hé " + mentionné + " tu trouve pas qu'elle est bonne ma copine ?"
			,"jsais pas si t'a vu " + mentionné + " mais ma copine elle est super bonne !"
			,"j'ai jamais vu une meuf aussi bonne que ma copine, t'es d'accord hein " + mentionné + " ?"
			,"salut " + mentionné + ", c'est juste pour te dire que ma copine c'est la meuf la plus bonne sur terre !"
			,"hé " + mentionné + " j'te l'avais pas encore dit mais ma copine est ultra bonne franchement"
			, mentionné + " bon entre nous, ma copine, elle est quand même extra bonne non?"
		);

		var phraseRandom = Math.floor(Math.random()*phrases.length);

		msg.channel.send(phrases[phraseRandom]);
	}
}
