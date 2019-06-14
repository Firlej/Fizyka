// KLASA ATOMU
class Atom {
    constructor() {
        // MASA
        this.mass = 1;
        // ROZMIAR
        this.r = 5;
        // POZYCJA
        this.pos = vec(-R, random(-R, R));
        // PREDKOSC
        this.vel = vec(random(-MAX_VEL, MAX_VEL), random(-MAX_VEL, MAX_VEL));
        // NATEZENIE KOLORU CZERWONEGO PRZY KOLIZJI
        this.collisionLevel = 1;
    }

    // FUNKCJA ZWRACAJACA DOKLADNĄ KOPIĘ ATOMU. UZYWANE PRZY DEBUGOWANIU
    copy() {
        let a = new Atom();
        a.mass = this.mass;
        a.pos = this.pos.copy();
        a.vel = this.vel.copy();
        return a;
    }

    // DETEKCJA KOLIZJI ATOMÓW ZE ŚCIANĄ
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

    // UPDATE POZYCJI ATOMU ORAZ KOREKCJA W PRZYPADKU KOLIZJI ZE ŚCIANĄ
    update() {
        this.pos.add(this.vel);
        this.walls();
    }
    
    draw() {
        // ZMAPOWANIE Z UKLADU PROGRAMU DO ODPOWIEDNICH PIKSELI NA EKRANIE
        let x = map(this.pos.x, -R, R, 0, width);
        let y = map(this.pos.y, -R, R, 0, height);
        let r = this.r * scale;

        // RYSOWANIE ATOMU
        fill('black');
        ellipse(x, y, r);
        // RYSOWANIE CZERWONEGO ATOMU KTÓRY ILUSTRUJE WYSTEPUJACE KOLIZJE W KOLORZE CZERWONYM
        fill(rgba(200, 0, 0, this.collisionLevel));
        this.collisionLevel *= 0.7;
        ellipse(x, y, r);

        // RYSOWANIE WEKTORÓW PREDKOŚCI
        if (drawLines) {
            stroke("blue");
            line(x,y, x + this.vel.x * 10, y+ this.vel.y * 10);
            stroke("red");
            line(x,y, x + this.vel.x * 10, y);
            stroke("green");
            line(x,y, x, y+ this.vel.y * 10);
        }
    }
}

// SPRAWDZANIE CZY ATOMY KOLIDUJĄ
function atomsOverlap(a, b) {
    return (distSq(a.pos.x, a.pos.y, b.pos.x, b.pos.y) <= pow(a.r + b.r, 2)) ? true : false;
}

// OBLICZANIE STATYCZNEJ KOLICJI
function staticCollisionResolution(a, b) {
    let d = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
    let displacement = a.pos.copy().sub(b.pos).setMag(a.r + b.r - d).mult(1 / 2);
    a.pos.add(displacement);
    b.pos.sub(displacement);
}

// OBLICZANIE DYNAMICZNEJ KOLIZJI
function dynamicCollisionResolution(a, b) {
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
