const N = 1000;
const R = 1000; // container size
const W = 5000;

const MAX_VEL = W / 2 / N;
let maxcnt = 0;

const atoms = [];
const atoms1 = [];
const atoms2 = [];

const posE = 10;
const velE = 5;

let entropy;
let entropy_values = [];
const entropy_limit = 5000;
let max_e = null;
let min_e = null;

// let v1 = vec(100, 500),
// 	v2 = vec(200, 100);

let scale = 0;

let factorial = [];

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
		// atom.vel.mult(0);
		atoms.push(atom);
		atoms1.push(atom.copy());
		atoms2.push(atom.copy());
	}

	setTimeout(function () {
		setInterval(function () {
			let sum = 0;
			for (const a of atoms) {
				sum += a.vel.mag();
			}
			// console.log(sum);
			// console.log("maxcnt", MAX_VEL, maxcnt);
		}, 1000);
	}, 1000)

	callback();
}

function draw() {
	background('grey');

	for (let i = 0; i < atoms.length; i++) {
		atoms[i].update();
		atoms[i].draw();
		atoms[i].collides = false;
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

	let len = entropy_values.length;
	stroke("lime");
	beginShape();
	ctx.moveTo(0, height);
	for (let i = 0; i < len; i++) {
		let val = map(entropy_values[i], min_e, max_e, height, 0);
		vertex(i / (entropy_values.length - 1) * width, val);
	}
	vertex(width, height);
	endShape();
}

function mousePressed() {
	// let x = map(mouseX, 0, width, -R, R);
	// let y = map(mouseY, 0, height, -R, R);
	// atoms[0].pos.set(x, y);
	// atoms[0].vel.set(5, 0);

	// v2.set(mouseX, mouseY);
	// console.log(v2.dot(v1));
	calcEntropy();
}

function calcEntropy() {
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
		let pxe = floor(map(a.pos.x, -R, R, 0, posE));
		let pye = floor(map(a.pos.y, -R, R, 0, posE));
		let vxe = floor(map(a.vel.x, -W, W, 0, velE));
		let vye = floor(map(a.vel.y, -W, W, 0, velE));

		// console.log(pxe, pye, vxe, vye);

		// console.log(pxe, pye, vxe, vye, entropy[pxe][pye][vxe][vye], a);

		try {
			// entropy[pxe][pye]++;
			entropy[pxe][pye][vxe][vye]++;
		} catch (error) {
			// console.error(pxe, pye, vxe, vye, entropy[pxe][pye][vxe][vye], a);
			// entropy[pxe][pye][vxe][vye] = 1;
			// console.error(pxe, pye, vxe, vye, entropy[pxe][pye][vxe][vye], a);
			// console.error(error);
		}
	}

	let res = factorial[N];
	// console.log(res);

	for (let i = 0; i < posE; i++) {
		for (let j = 0; j < posE; j++) {
			// res -= factorial[entropy[i][j]];
			for (let k = 0; k < velE; k++) {
				for (let l = 0; l < velE; l++) {
					// console.log(entropy[i][j][k][l], Math.log(factorial[entropy[i][j][k][l]]));
					res -= factorial[entropy[i][j][k][l]];
				}
			}
		}
	}

	// res = random(0, 1000);

	if (max_e == null || res > max_e) {
		max_e = res;
	}

	if (min_e == null || res < min_e) {
		min_e = res;
	}
	// console.log(res);
	entropy_values.push(res);
	if (entropy_values.length > entropy_limit) {
		entropy_values.shift();
	}
}