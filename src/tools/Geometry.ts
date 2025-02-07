

export class Point {

    public x: number = 0;
    public y: number = 0;
    constructor(x: number = 0, y: number = 0) {
        this.x = x; this.y = y;
    }
}

export class Size {
    public w: number = 0;
    public h: number = 0;
    constructor(w: number = 0, h: number = 0) {
        this.w = w, this.h = h;
    }
}
export class Rect {

    public x: number = 0;
    public y: number = 0;
    public w: number = 0;
    public h: number = 0;
    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        this.x = x; this.y = y; this.w = w, this.h = h;
    }
    public area() {
        return this.w * this.y;
    }
    public inBox(p: Point) {
        return p.x >= this.x && p.y >= this.y && (p.x - this.x) <= this.w && (p.y - this.y) <= this.h;
    }
}