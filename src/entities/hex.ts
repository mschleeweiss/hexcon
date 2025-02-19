export class Point {
    constructor(public x: number, public y: number) { }
}

export class Hex {
    constructor(public q: number, public r: number, public s: number) {
        if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
    }

    equals(hex: Hex): boolean {
        return hex && this.q === hex.q && this.r === hex.r && this.s === hex.s;
    }

    add(b: Hex): Hex {
        return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
    }


    subtract(b: Hex): Hex {
        return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
    }


    scale(k: number): Hex {
        return new Hex(this.q * k, this.r * k, this.s * k);
    }

    rotateLeft(): Hex {
        return new Hex(-this.s, -this.q, -this.r);
    }

    rotateRight(): Hex {
        return new Hex(-this.r, -this.s, -this.q);
    }

    static directions: Hex[] = [new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)];

    static direction(direction: number): Hex {
        return Hex.directions[direction];
    }

    neighbor(direction: number): Hex {
        return this.add(Hex.direction(direction));
    }

    neighbors(): Hex[] {
        return [...Array(Hex.directions.length).keys()].map(value => this.neighbor(value));
    }

    len(): number {
        return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
    }


    distance(b: Hex): number {
        return this.subtract(b).len();
    }

    coords(): number[] {
        return [
            this.q,
            this.r,
            this.s
        ];
    }
}
