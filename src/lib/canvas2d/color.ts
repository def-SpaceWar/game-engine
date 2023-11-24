export interface C2DColor {
    toCanvas(): string | CanvasGradient | CanvasPattern;
}

export class SolidColor implements C2DColor {
    static random() {
		return new SolidColor(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }

    constructor(public r: number, public g: number, public b: number) {}

    toCanvas() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}
