class Atom {
    constructor() {
        this.mass = 1;
        this.r = 5;
        this.pos = vec(-R, random(-R, R));
        // this.pos = vec(random(-R, R), random(-R, R));
        this.vel = vec(random(-MAX_VEL, MAX_VEL), random(-MAX_VEL, MAX_VEL));

        this.collisionLevel = 1;
    }

    copy() {
        let a = new Atom();
        a.mass = this.mass;
        a.pos = this.pos.copy();
        a.vel = this.vel.copy();
        return a;
    }

    walls() {
        if (this.pos.x < -R+this.r) {
            this.vel.x *= -1;
            this.pos.x = -R+this.r;
        } else if (this.pos.x > R-this.r) {
            this.vel.x *= -1;
            this.pos.x = R-this.r;
        } else if (this.pos.y < -R+this.r) {
            this.vel.y *= -1;
            this.pos.y = -R+this.r;
        } else if (this.pos.y > R-this.r) {
            this.vel.y *= -1;
            this.pos.y = R-this.r;
        }
    }

    update() {
        this.pos.add(this.vel);
        this.walls();
    }

    draw() {

        push()
        let x = map(this.pos.x, -R, R, 0, width);
        let y = map(this.pos.y, -R, R, 0, height);
        let r = this.r * scale;
        translate(x, y);

        fill('black');
        ellipse(0, 0, r);
        fill(rgba(200, 0, 0, this.collisionLevel));
        this.collisionLevel *= 0.7;
        ellipse(0, 0, r);

        if (drawLines) {
            stroke("blue");
            line(0, 0, this.vel.x * 10, this.vel.y * 10);
            stroke("red");
            line(0, 0, this.vel.x * 10, 0);
            stroke("green");
            line(0, 0, 0, this.vel.y * 10);
        }
        pop();
    }
}

function atomsOverlap(a, b) {
    return (distSq(a.pos.x, a.pos.y, b.pos.x, b.pos.y) <= pow(a.r + b.r, 2)) ? true : false;
}

function staticCollisionResolution(a, b) {
    if (atomsOverlap(a, b)) {
        let d = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
        let displacement = a.pos.copy().sub(b.pos).setMag(a.r + b.r - d).mult(1 / 2);
        a.pos.add(displacement);
        b.pos.sub(displacement);
    }
}

function dynamicCollisionResolution(a, b) {
    if (atomsOverlap(a, b)) {

        let normal = a.pos.copy().sub(b.pos).normalize();
        let tangent = vec(-normal.y, normal.x);

        let dpTangentA = a.vel.dot(tangent);
        let dpTangentB = b.vel.dot(tangent);

        let dpNormalA = a.vel.dot(normal);
        let dpNormalB = b.vel.dot(normal);

        // let m1 = (dpNormalA * (a.mass - b.mass) + 2 * b.mass * dpNormalB) / (a.mass + b.mass);
        // let m2 = (dpNormalB * (b.mass - a.mass) + 2 * a.mass * dpNormalA) / (a.mass + b.mass);

        let m1 = dpNormalB;
        let m2 = dpNormalA;
        
        a.vel = tangent.copy().mult(dpTangentA).add(normal.copy().mult(m1));
        b.vel = tangent.copy().mult(dpTangentB).add(normal.copy().mult(m2));

        a.collisionLevel = 1;
        b.collisionLevel = 1;
    }
}

// function lel1(a, b) {
//     if (atomsOverlap(a, b)) {
//         let translation = a.pos.copy().sub(b.pos);

//         let distance = translation.mag();
//         let sin, cos;
//         if (abs(translation.x) > abs(translation.y)) {
//             cos = translation.x / distance;
//             sin = sqrt(1 - cos * cos);

//             if (translation.y < 0)
//                 sin = -sin;
//         } else {
//             sin = translation.y / distance;
//             cos = sqrt(1 - sin * sin);

//             if (translation.x < 0)
//                 cos = -cos;
//         }

//         let velocity = a.vel.copy().sub(b.vel);
//         let v1 = cos * velocity.x + sin * velocity.y;
//         let v2 = sin * velocity.x - cos * velocity.y;

//         // let bf, af;
//         // bf = a.vel.mag()+b.vel.mag();
//         // a.vel.set(b.vel.x + v2 * sin, b.vel.y - v2 * cos);
//         // b.vel.set(b.vel.x + v1 * cos, b.vel.y + v1 * sin);
//         // af = a.vel.mag()+b.vel.mag();

//         let bf, af;
//         bf = a.vel.mag() + b.vel.mag();
//         a.vel.set(a.vel.x - v1 * cos, a.vel.y - v1 * sin);
//         b.vel.set(b.vel.x + v1 * cos, b.vel.y + v1 * sin);
//         af = a.vel.mag() + b.vel.mag();

//         // console.log("green",bf, af, abs(bf-af));

//         a.collisionLevel = 1;
//         b.collisionLevel = 1;
//     }
// }

// function lel2(a, b) {
//     if (atomsOverlap(a, b)) {
//         let translation = a.pos.copy().sub(b.pos);

//         let distance = translation.mag();
//         let sin, cos;
//         if (abs(translation.x) > abs(translation.y)) {
//             cos = translation.x / distance;
//             sin = sqrt(1 - cos * cos);

//             if (translation.y < 0)
//                 sin = -sin;
//         } else {
//             sin = translation.y / distance;
//             cos = sqrt(1 - sin * sin);

//             if (translation.x < 0)
//                 cos = -cos;
//         }

//         let velocity = a.vel.copy().sub(b.vel);
//         let v1 = cos * velocity.x + sin * velocity.y
//         let v2 = sin * velocity.x - cos * velocity.y;

//         let bf, af;
//         bf = a.vel.mag() + b.vel.mag();
//         a.vel.set(b.vel.x + v2 * sin, b.vel.y - v2 * cos);
//         b.vel.set(b.vel.x + v1 * cos, b.vel.y + v1 * sin);
//         af = a.vel.mag() + b.vel.mag();

//         // console.log("blue",bf, af, abs(bf-af));

//         a.collisionLevel = 1;
//         b.collisionLevel = 1;
//     }
// }