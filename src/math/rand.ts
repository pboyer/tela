export class Rand {
    private seed : number;
    constructor(seed : number) { this.seed = seed; }
    next() : number {
        let x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    nextInRange(min : number, max : number) : number {
        let diff = max - min;
        return (this.next() * diff) | 0 + min
    }
}