// rechneronline.de/sehwinkel/angular-diameter.php 4.196 cm 50 cm 8 l.
// rechneronline.de/sehwinkel/angular-diameter.php 4.628 cm 50 cm 5.3 l.

const SHOW_TIME = 30000;
const WIPE_TIME = 5000;
const PAUSE_TIME = 1000;

const SCREENS = [
	'rgb(255,0,0)',
	'rgb(0,255,0)',
	'rgb(0,0,255)',
	'rgb(255,255,0)',
	'rgb(0,255,182)',
	'rgb(55,0,152)',
	'rgb(255,164,0)',
	'rgb(0,170,255)',
	'rgb(176,255,0)',
	'rgb(255,0,255)',
	'rgb(0,255,255)',
	'rgb(158,0,255)'
];

const PROGRAM = [...SCREENS, ...SCREENS, ...SCREENS, ...SCREENS];

const BLACK = 'rgb(0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';

const CHANGE_STEP = 10;

const CONTROLLER = new AbortController();

var background_color = BLACK;

var answers = [];

var current_screen = 0;

var stage = 1;

function color_forward() {
	var answer = document.getElementById("answer");

	let bck = answer.style.background

	if (bck == "") {
		bck = "rgb(0, 0, 0)";
	}

	let nums = bck.slice(4, -1);
	let blah = nums.split(", ");

	if (blah[0] < 255 && blah[1] == 0 && (blah[2] == 0 || blah[2] >= 255))
		modify_color(0);
	if (blah[0] > 0 && blah[1] >= 255 && blah[2] == 0)
		modify_color(0, false);
	if (blah[0] >= 255 && blah[1] < 255 && blah[2] == 0)
		modify_color(1);
	if (blah[0] == 0 && blah[1] > 0 && blah[2] >= 255) 
		modify_color(1, false);
	if (blah[0] == 0 && blah[1] >= 255 && blah[2] < 255)
		modify_color(2);
	if (blah[0] >= 255 && blah[1] == 0 && blah[2] > 0)
		modify_color(2, false);
	return;
}

function color_backward() {
	var answer = document.getElementById("answer");

	let bck = answer.style.background

	if (bck == "") {
		bck = "rgb(0, 0, 0)";
	}

	let nums = bck.slice(4, -1);
	let blah = nums.split(", ");

	if (blah[0] >= 255 && blah[1] == 0 && blah[2] < 255)
		modify_color(2);
	if (blah[0] > 0 && blah[1] == 0 && blah[2] >= 255)
		modify_color(0, false);
	if (blah[0] == 0 && blah[1] < 255 && blah[2] >= 255)
		modify_color(1);
	if (blah[0] == 0 && blah[1] >= 255 && blah[2] > 0) 
		modify_color(2, false);
	if (blah[0] < 255 && blah[1] >= 255 && blah[2] == 0)
		modify_color(0);
	if (blah[0] >= 255 && blah[1] > 0 && blah[2] == 0)
		modify_color(1, false);
	return;
}

function modify_color(index, increase = true, change_step = CHANGE_STEP) {
	var answer = document.getElementById("answer");

	let bck = answer.style.background

	if (bck == "") {
		bck = "rgb(0, 0, 0)";
	}

	let nums = bck.slice(4, -1);
	let blah = nums.split(", ");

	if (increase) {
		blah[index] = parseInt(blah[index], 10) + change_step;
	} else {
		blah[index] = parseInt(blah[index], 10) - change_step;
	}

	let res = "rgb(" + blah[0] + ", " + blah[1] + ", " + blah[2] + ")";
	console.log(res);
	answer.style.background = res;
}

function modify_color_inverted(index1, index2, increase = true, change_step = CHANGE_STEP) {
	var answer = document.getElementById("answer");

	let bck = answer.style.background

	if (bck == "") {
		bck = "rgb(255, 255, 255)";
	}

	let nums = bck.slice(4, -1);
	let blah = nums.split(", ");

	if (increase) {
		blah[index1] = parseInt(blah[index1], 10) + change_step;
		blah[index2] = parseInt(blah[index2], 10) + change_step;
	} else {
		blah[index1] = parseInt(blah[index1], 10) - change_step;
		blah[index2] = parseInt(blah[index2], 10) - change_step;
	}

	let res = "rgb(" + blah[0] + ", " + blah[1] + ", " + blah[2] + ")";
	answer.style.background = res;
}

function sleep(ms) {
	console.log('sleeping...' + ms);

	return new Promise(resolve => setTimeout(resolve, ms));
}

function numpads(e) {
	var is_black = background_color == BLACK;
	console.log('Is black: ' + is_black);
	console.log('Key: ' + e.keyCode);

	switch (e.keyCode) {
		case 38:
		    color_forward();
		    break;
		case 40:
			color_backward();
		    break;
		default:
			return;
	};
}

async function q_key(e) {
	if (e.keyCode != 81) {
		return;
	}

	dump_globals();

	var body = document.getElementById("body");
	var question = document.getElementById("question");
	var plus = document.getElementById("plus");
	var answer = document.getElementById("answer");
	var wipeout = document.getElementById('wipeout');

	if (current_screen >= PROGRAM.length) {
		answers.push(answer.style.background);
		var results_div = document.getElementById("results");
		results_div.style.display = "block";
		results_div.innerHTML += answers.join("<br>");

		CONTROLLER.abort();
		return;
	}

	if (current_screen == PROGRAM.length / 4) {
		stage = 2;
		background_color = WHITE;

		body.style.background = WHITE;
		question.style.background = WHITE;
		plus.style.background = WHITE;
		plus.style.color = BLACK;
	} else if (current_screen == PROGRAM.length / 2) {
		stage = 3;
		background_color = BLACK;

		body.style.background = BLACK;
		question.style.background = BLACK;
		plus.style.background = BLACK;
		plus.style.color = WHITE;
	} else if (current_screen == PROGRAM.length / 4 * 3) {
		stage = 4;
		background_color = WHITE;

		body.style.background = WHITE;
		question.style.background = WHITE;
		plus.style.background = WHITE;
		plus.style.color = BLACK;
	}

	if (stage == 3) {
		background_color = BLACK;

		body.style.background = BLACK;
		question.style.background = BLACK;
		plus.style.background = BLACK;
		plus.style.color = WHITE;
	} else if (stage == 4) {
		background_color = WHITE;

		body.style.background = WHITE;
		question.style.background = WHITE;
		plus.style.background = WHITE;
		plus.style.color = BLACK;
	}

	if (current_screen < PROGRAM.length) {
		wipeout.style.display = 'block';

    	await sleep(WIPE_TIME);

    	wipeout.style.display = 'none';

    	answers.push(answer.style.background);
		answer.style.background = background_color;

    	await sleep(PAUSE_TIME);

    	question.style.background = PROGRAM[current_screen];

    	await sleep(SHOW_TIME);

    	question.style.background = background_color;

    	if (stage == 3) {
    		background_color = WHITE;

			body.style.background = WHITE;
			question.style.background = WHITE;
			plus.style.background = WHITE;
			plus.style.color = BLACK;
    	} else if (stage == 4) {
    		background_color = BLACK;

			body.style.background = BLACK;
			question.style.background = BLACK;
			plus.style.background = BLACK;
			plus.style.color = WHITE;
    	}

    	answer.style.background = PROGRAM[current_screen];

    	current_screen++;
	}
}

async function enter_key(e) {
	if (e.keyCode != 13) {
		return;
	}

	dump_globals();

    var instruction = document.getElementById("instruction");
   	instruction.style.display = 'none';

   	await sleep(PAUSE_TIME);

   	var question = document.getElementById("question");
    question.style.background = PROGRAM[current_screen];

    await sleep(SHOW_TIME);

    question.style.background = background_color;
    answer.style.background = PROGRAM[current_screen];

    current_screen++;
}

function dump_globals() {
	console.log('Current Screen: ' + current_screen);
	console.log('Background color: ' + background_color);
	console.log('Answers: ' + answers.join(', '));
}

console.log(PROGRAM.join(' '));

document.addEventListener('keydown', numpads);
document.addEventListener('keydown', q_key, { signal: CONTROLLER.signal });
document.addEventListener('keydown', enter_key, { once: true });
