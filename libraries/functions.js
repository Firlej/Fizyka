let canvas, ctx;

let width, height;

let windowWidth, windowHeight;

let mouseX, mouseY;
let keyCode;

let images = [];

const HALF_PI = Math.PI / 2;
const PI = Math.PI;
const TWO_PI = Math.PI * 2;
let frameCount = 0;

window.onload = function () {
    // canvas = document.createElement('canvas');
    // canvas.id = "canvas";
    // let gameArea = document.getElementById("gameArea");
    // gameArea.insertBefore(canvas, gameArea.firstChild);

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    // ctx.mozImageSmoothingEnabled = false;
    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;
    // ctx.imageSmoothingEnabled = false;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    addEventListeners();

    setLibValues();

    setup(function () {
        setInterval(function () {
            draw();
            frameCount++;
        }, 1000 / 60);
    });
}

function redraw() {
    draw();
}

function setLibValues() {
    width = canvas.width;
    height = canvas.height;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}

let sources = {};

function imagesLoaded() {}

function loadImages(sources) {

    let numImages = 0;
    for (src in sources) {
        numImages++;
    }
    let loadedImages = 0;
    for (src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            loadedImages++;
            if (loadedImages == numImages) {
                //console.log("Images loaded!");
                imagesLoaded();
            }
        };
        images[src].src = sources[src];
    }
}

function image(img, x, y, width, height) {
    ctx.drawImage(img, x, y, width, height);
}

function resizeCanvas(width, height) {
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    canvas.width = width;
    canvas.height = height;

    setLibValues();
}

function background(color) {
    fill(color);
    rect(0, 0, canvas.width, canvas.height);
}

function clearBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function font(f) {
    ctx.font = f;
}

function textAlign(a) {
    ctx.textAlign = a;
}

function text(text, x, y) {
    ctx.fillText(text, x, y);
}

function randomRgb() {
    return rgba(random(0, 256), random(0, 256), random(0, 256));
}

function fill(color) {
    ctx.fillStyle = color;
}

function ellipse(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
}

// function ellipse(x, y, rx, ry = rx) {
//     ctx.beginPath();
//     // ctx.arc(x, y, r, 0, Math.PI * 2, true);
//     ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
//     ctx.stroke();
// }

function rect(x, y, width, height) {
    ctx.fillRect(x, y, width, height);
}

function strokeRect(x, y, width, height) {
    ctx.strokeRect(x, y, width, height);
}

function lineWidth(x) {
    ctx.lineWidth = x;
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function globalAlpha(a = 1) {
    ctx.globalAlpha = a;
}

function rgba(r, g, b, a = 1) {
    return "rgba(" + floor(r) + ", " + floor(g) + ", " + floor(b) + ", " + a + ")";
}

function hsl(h, s, l, a = 1) {
    return "hsl(" + floor(h) + ", " + floor(s) + "%, " + floor(l) + "%, " + a + ")";
}

function lerp(start, end, rate) {
    return (end - start) * rate + start;
}

// function factorial(n) {
//     let res = 1;
//     for (let i = 2; i <=n; i++) {
//         res *= i;
//         // console.log(res);
//     }
//     return res;
// }

// MATH SHORTS

function pow(a,b) {
    return Math.pow(a,b);
}

function sqrt(a) {
    return Math.sqrt(a);
}

function floor(a) {
    return Math.floor(a);
}

function ceil(a) {
    return Math.ceil(a);
}

function round(a) {
    return Math.round(a);
}

function abs(a) {
    return Math.abs(a);
}

function random(a, b) {
    return Math.random() * (b - a) + a;
}

function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}

function map(x, fromA, fromB, toA, toB) {
    return (x - fromA) / (fromB - fromA) * (toB - toA) + toA;
}

// ARRAY PROTOTYPES

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
Array.prototype.first = function () {
    return this[0];
}
Array.prototype.last = function () {
    return this[this.length - 1];
}

function push() {
    ctx.save()
};

function translate(x, y) {
    ctx.translate(x, y);
}

function pop() {
    ctx.restore();
}

function beginShape() {
    ctx.beginPath();
}

function vertex(x, y) {
    ctx.lineTo(x, y);
}

function endShape() {
    ctx.closePath();
    ctx.stroke();
}

function stroke(color) {
    ctx.strokeStyle = color;
}

function mouseContained(x1, y1, x2, y2) {
    return (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2);
}

// STORAGE PROTOTYPES

Storage.prototype.hasKey = function (key) {
    return this.getItem(key) !== null;
}
Storage.prototype.getParsed = function (key) {
    return JSON.parse(this.getItem(key));
}

// EVENT LISTENERS

function mousePressed() {}

function mouseReleased() {}

function windowResized() {}

function keyPressed() {}

function addEventListeners() {
    canvas.addEventListener("mousedown", mousePressed);
    canvas.addEventListener("mouseup", mouseReleased);
    canvas.addEventListener('mousemove', updateMouseMove);

    window.addEventListener("keypress", function (evt) {
        keyCode = evt.keyCode;
        keyPressed(keyCode);
    });

    window.addEventListener('touchstart', function (evt) {
        updateTouchMove(evt)
        mousePressed();
        evt.preventDefault();
    });
    window.addEventListener('touchend', mouseReleased);
    window.addEventListener('touchmove', function (evt) {
        evt.preventDefault();
        updateTouchMove(evt);
    });

    window.onresize = function (event) {
        setLibValues();
        windowResized();
    };

    function updateMouseMove(evt) {
        let rect = canvas.getBoundingClientRect();
        let root = document.documentElement;
        mouseX = evt.clientX - rect.left - root.scrollLeft;
        mouseY = evt.clientY - rect.top - root.scrollTop;
    }

    function updateTouchMove(evt) {
        let rect = canvas.getBoundingClientRect();
        let root = document.documentElement;
        mouseX = evt.touches[0].clientX - rect.left - root.scrollLeft;
        mouseY = evt.touches[0].clientY - rect.top - root.scrollTop;
    }
}

// VECTOR

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    
    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    mag() {
        return Math.sqrt(this.magSq());
    }

    normalize() {
        var len = this.mag();
        if (len !== 0) this.mult(1 / len);
        return this;
    }

    setMag(n) {
        this.normalize().mult(n);
        return this;
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    rotate(a) {
        var newHeading = this.heading() + a;
        var mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }
}

function vec(x = 0, y = 0) {
    return new Vector(x, y);
}

function distSq(x1,y1,x2,y2) {
    return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
}

function dist(x1,y1,x2,y2) {
    return Math.sqrt(distSq(x1,y1,x2,y2));
}

