module.exports.run = (args) => {
	let gameBoard = args;
	if (gameBoard.indexOf("B") === -1) {
		gameBoard ="`-------------------------\n" +
					"|  " + gameBoard.charAt(0) + "  |  " + gameBoard.charAt(1) + "  |  " + gameBoard.charAt(2) + "  |  " + gameBoard.charAt(3) + "  |\n" +
		 			"-------------------------\n" +
					"|  " + gameBoard.charAt(4) + "  |  " + gameBoard.charAt(5) + "  |  " + gameBoard.charAt(6) + "  |  " + gameBoard.charAt(7) + "  |\n" +
		 			"-------------------------\n" +
		 			"|  " + gameBoard.charAt(8) + "  |  " + gameBoard.charAt(9) + "  |  " + gameBoard.charAt(10) + "  |  " + gameBoard.charAt(11) + "  |\n" +
		 			"-------------------------\n" +
		 			"|  " + gameBoard.charAt(12) + "  |  " + gameBoard.charAt(13) + "  |  " + gameBoard.charAt(14) + "  |  " + gameBoard.charAt(15) + "  |\n" +
		 			"-------------------------\n" + "`";
	}
	else {
		gameBoard ="`-------------------------\n" +
					"|  " + gameBoard.charAt(0) + "  |  " + gameBoard.charAt(1) + "  |  " + gameBoard.charAt(2) + "  |  " + gameBoard.charAt(3) + "  |\n" +
		 			"-------------------------\n" +
					"|  " + gameBoard.charAt(4) + "  |  " + gameBoard.charAt(5) + "  |  " + gameBoard.charAt(6) + "  |  " + gameBoard.charAt(7) + "  |\n" +
		 			"-------------------------\n" +
		 			"|  " + gameBoard.charAt(8) + "  |  " + gameBoard.charAt(9) + "  |  " + gameBoard.charAt(10) + "  |  " + gameBoard.charAt(11) + "  |\n" +
		 			"-------------------------\n" +
		 			"|  " + gameBoard.charAt(12) + "  |  " + gameBoard.charAt(13) + "  |  " + gameBoard.charAt(14) + "  |  " + gameBoard.charAt(15) + "  |\n" +
		 			"-------------------------\n" + "`";
		let index = gameBoard.indexOf("Z");
		gameBoard = gameBoard.substr(0, index-1) + "10" + gameBoard.substr(index+1);
		index = gameBoard.indexOf("J");
		gameBoard = gameBoard.substr(0, index-1) + "11" + gameBoard.substr(index+1);
		index = gameBoard.indexOf("Q");
		gameBoard = gameBoard.substr(0, index-1) + "12" + gameBoard.substr(index+1);
		index = gameBoard.indexOf("B");
		gameBoard = gameBoard.substr(0, index) + "\u221A" + gameBoard.substr(index+1);
	}
	return gameBoard;
};

module.exports.help = {
	"name": "snhGameBoardGenerator"
}