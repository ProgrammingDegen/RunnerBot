module.exports.run = (answer, state, target) => {
	let answerString = "ALIEYOUMSTNRHDGK";
	let solution = [];
	for (let i = 0; i < answer.length; i++) {
		let x = answer.charAt(i);
		let index = answerString.indexOf(x);
		solution.push(state.charAt(index));
	}
	let op = solution[1];
	for (let i = 0; i < solution.length; i++) {
		if (solution[i] === "Z") { solution[i] = 10; }
		else if (solution[i] === "J") { solution[i] = 11; }
		else if (solution[i] === "Q") { solution[i] = 12; }
	}
	if (op != "+" && op != "B" && op != "*" && op != "/") {
		solution.unshift(0);
	}
	else {
		if (op === "+") {
			if (target === parseInt(solution[0]) + parseInt(solution[2])) { solution.unshift(1); }
			else { solution.unshift(0); }
		}
		else if (op === "*") {
			if (target === parseInt(solution[0]) * parseInt(solution[2])) { solution.unshift(1); }
			else { solution.unshift(0); }
		}
		else if (op === "/") {
			if (target === parseInt(solution[0]) / parseInt(solution[2])) { solution.unshift(1); }
			else { solution.unshift(0); }
		}
		else {
			if (target === Math.sqrt(parseInt(solution[0])) + Math.sqrt(parseInt(solution[2]))) { solution.unshift(2); }
			else { solution.unshift(0); }
		}
	}
	return solution;
}

module.exports.help = {
	"name": "snhGameHandlerAnswer"
}
