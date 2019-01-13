module.exports.run = () => {
	// Initialize game variables
	// "B" is "sqrt(a)+sqrt(b)" (Possibly also "-" in the future)
	let gameVar = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Z", "J", "Q", "+", "B", "*", "/"];
	// Utilize Fisher-Yates to shuffle
	function shuffle(array) {
		var m = array.length, t, i;
		while (m) {
	    	i = Math.floor(Math.random() * m--);
	    	t = array[m];
	    	array[m] = array[i];
	    	array[i] = t;
	  	}
	}
	shuffle(gameVar);
	// Turn array to string
	gameVar = gameVar.join("");
	return gameVar;
};

module.exports.help = {
	"name": "snhGameStateGenerator"
}