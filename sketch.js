const N = 1000;
const R = 500;
const W = 2000;

const MAX_VEL = W / 2 / N;
let maxcnt = 0;

const atoms = [];

const posE = 10;
const velE = 1;

let entropy;
let entropy_values = [];
const entropy_limit = 5000;
let max_e = null;
let min_e = null;

let scale = 0;

let factorial = [];

let fps = 0;

let drawLines = false;

function setup(callback) {
	resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));

	factorial[0] = 1;
	for (let i = 1; i <= 10000; i++) {
		factorial[i] = factorial[i - 1] + Math.log(i);
	}

	scale = width / (R * 2);

	entropy = [];
	for (let i = 0; i < posE; i++) {
		entropy[i] = [];
		for (let j = 0; j < posE; j++) {
			entropy[i][j] = [];
			for (let k = 0; k < velE; k++) {
				entropy[i][j][k] = [];
				for (let l = 0; l < velE; l++) {
					entropy[i][j][k][l] = 0;
				}
			}
		}
	}

	for (let i = 0; i < N; i++) {
		let atom = new Atom();
		atoms.push(atom);
	}

	callback();
}

function draw() {
	background(rgb(155, 155, 155));

	for (let i = 0; i < atoms.length; i++) {
		atoms[i].update();
		atoms[i].draw();
	}

	for (let i = 0; i < atoms.length; i++) {
		const a = atoms[i];
		for (let j = i + 1; j < atoms.length; j++) {
			const b = atoms[j];
			if (a != b) {
				if (atomsOverlap(a, b)) {
					staticCollisionResolution(a, b);
					dynamicCollisionResolution(a, b);
				}
			}
		}
	}

	calcEntropy();

	// Entropy chart
	let len = entropy_values.length;
	stroke("lime");
	beginShape();
	ctx.moveTo(0, height);
	for (let i = 0; i < len; i++) {
		let val = map(entropy_values[i], min_e, max_e, height * 0.95, height * 0.05);
		vertex(i / (entropy_values.length - 1) * width, val);
	}
	vertex(width, height);
	endShape();

	// FPS counter
	textAlign("right");
	fill("blue");
	font("40px Arial");
	text("FPS: " + fps, width - 20, 40);
	text("N: " + N, width - 20, 80);
	text("R: " + R, width - 20, 120);
	text("W: " + W, width - 20, 160);

	fps++;
	setTimeout(function () {
		fps--;
	}, 1000);
}

function mousePressed() {
	drawLines = !drawLines;
}

function calcEntropy() {

	if (frameCount < 0) {
		return;
	}

	entropy = [];
	for (let i = 0; i < posE; i++) {
		entropy[i] = [];
		for (let j = 0; j < posE; j++) {
			entropy[i][j] = [];
			for (let k = 0; k < velE; k++) {
				entropy[i][j][k] = [];
				for (let l = 0; l < velE; l++) {
					entropy[i][j][k][l] = 0;
				}
			}
		}
	}

	for (a of atoms) {
		a.walls();
		let pxe = floor(map(a.pos.x, -R, R, 0, posE));
		let pye = floor(map(a.pos.y, -R, R, 0, posE));
		let vxe = floor(map(a.vel.x, -W, W, 0, velE));
		let vye = floor(map(a.vel.y, -W, W, 0, velE));

		try {
			entropy[pxe][pye][vxe][vye]++;
		} catch (error) {
			console.error(a, pxe, pye, vxe, vye, error);
		}
	}

	let res = factorial[N];

	for (let i = 0; i < posE; i++) {
		for (let j = 0; j < posE; j++) {
			for (let k = 0; k < velE; k++) {
				for (let l = 0; l < velE; l++) {
					res -= factorial[entropy[i][j][k][l]];
				}
			}
		}
	}

	if (max_e == null || res > max_e) {
		max_e = res;
	}

	if (min_e == null || res < min_e) {
		min_e = res;
	}

	entropy_values.push(res);

	if (entropy_values.length > entropy_limit) {
		entropy_values.shift();
	}
}