import { Entity } from "../engine/base";
import { Matrix2D, Vector2D } from "./linear_algebra";

const cos = Math.cos,
    sin = Math.sin;

export class Transform2D {
    entity?: Entity;
    private matrix: Matrix2D;

    constructor(
        public position: Vector2D,
        private _scale: Vector2D | Matrix2D,
        private _rotation: number
    ) {
        this.matrix = this.calculateMatrix();
    }

    private calculateMatrix() {
        return (this._scale instanceof Vector2D)
            ? new Matrix2D(
                cos(this._rotation) * this._scale.x,
                -sin(this._rotation) * this._scale.y,
                sin(this._rotation) * this._scale.x,
                cos(this._rotation) * this._scale.y,
            )
            : new Matrix2D(
                cos(this._rotation) * this._scale.a -
                sin(this._rotation) * this._scale.c,
                cos(this._rotation) * this._scale.b -
                sin(this._rotation) * this._scale.d,
                sin(this._rotation) * this._scale.a +
                cos(this._rotation) * this._scale.c,
                sin(this._rotation) * this._scale.b +
                cos(this._rotation) * this._scale.d,
            );
    }

    private recalculateMatrix() {
        this.matrix = this.calculateMatrix();
    }

    get rotation() { return this._rotation; }
    get scale() { return this._scale.clone(); }

    set rotation(rotation: number) {
        this._rotation = rotation;
        this.recalculateMatrix();
    }

    set scale(scale: Vector2D | Matrix2D) {
        this._scale = scale;
        this.recalculateMatrix();
    }

    toCtx(): [number, number, number, number, number, number] {
        return [
            this.matrix.a, this.matrix.c,
            this.matrix.b, this.matrix.d,
            this.position.x, this.position.y
        ];
    }

    transform(v: Vector2D) {
        return this.matrix.transform(v).add(this.position);
    }
}
