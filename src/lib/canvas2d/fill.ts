export interface C2DFill {
    toCanvas(ctx: CanvasRenderingContext2D): string | CanvasGradient | CanvasPattern;
}

export class C2DColor implements C2DFill {
    private _color: string;
    private isNotUpdated = false;

    static random() {
        return new C2DColor(Math.random() * 256, Math.random() * 256, Math.random() * 256);
    }

    constructor(private _r: number, private _g: number, private _b: number) {
        this._color = `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    get r() { return this._r; }
    get g() { return this._g; }
    get b() { return this._b; }

    set r(r: number) {
        this._r = r;
        this.isNotUpdated = true;
    }

    set g(g: number) {
        this._g = g;
        this.isNotUpdated = true;
    }

    set b(b: number) {
        this._b = b;
        this.isNotUpdated = true;
    }

    toCanvas() {
        return (this.isNotUpdated)
            ? (this._color = `rgb(${this.r}, ${this.g}, ${this.b})`)
            : this._color;
    }
}
