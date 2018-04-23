export interface Vec2 {
    [position: number]: number;
}

export function dup(v: Vec2) {
    return [v[0], v[1]];
}

export function neg(v: Vec2) {
    v[0] = -v[0];
    v[1] = -v[1];
    return v;
}

export function add(a: Vec2, b: Vec2): Vec2 {
    a[0] = a[0] + b[0];
    a[1] = a[1] + b[1];
    return a;
}

export function sub(a: Vec2, b: Vec2): Vec2 {
    a[0] = a[0] - b[0];
    a[1] = a[1] - b[1];
    return a;
}

export function mid(a: Vec2, b: Vec2): Vec2 {
    a[0] = (a[0] + b[0]) / 2;
    a[1] = (a[1] + b[1]) / 2;
    return a;
}

export function mul(a: Vec2, b: Vec2): Vec2 {
    a[0] = a[0] * b[0];
    a[1] = a[1] * b[1];
    return a;
}

export function scale(a: Vec2, b: number): Vec2 {
    a[0] = a[0] * b;
    a[1] = a[1] * b;
    return a;
}

export function div(a: Vec2, b: Vec2): Vec2 {
    a[0] = a[0] / b[0]
    a[1] = a[1] / b[1];
    return a;
}

export function perp(a: Vec2): Vec2 {
    let a1 = -a[1];
    a[1] = a[0];
    a[0] = a1;
    return a;
}

export function normalize(a: Vec2): Vec2 {
    let l = len(a);
    a[0] = a[0] / l;
    a[1] = a[1] / l;
    return a;
}

export function dist(a: Vec2, b: Vec2): number {
    let dx = a[0] - b[0];
    let dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy*dy);
}

export function equal(a: Vec2, b: Vec2): boolean {
    return a[0] == b[0] && a[1] == b[1];
}

export function aboutEqual(a: Vec2, b: Vec2, tol : number): boolean {
    return Math.abs(a[0]-b[0]) < tol && Math.abs(a[1]-b[1]) < tol;
}

export function dot(a: Vec2, b: Vec2): number {
    return a[0] * b[0] + a[1] * b[1];
}

export function cross(a: Vec2, b: Vec2): number {
    return a[0] * b[1] - a[1] * b[0];
}

export function len(a: Vec2): number {
    return Math.sqrt(a[0]*a[0] + a[1]*a[1]);
}