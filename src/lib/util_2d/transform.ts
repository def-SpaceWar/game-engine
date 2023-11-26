import { Entity } from "../ecs/base";
import { Matrix2D } from "./linear_algebra/matrix";
import { Vector2D } from "./linear_algebra/vector";

const cos = Math.cos,
    sin = Math.sin;

export class Transform2D {
    entity?: Entity;

    constructor(
        public pos: Vector2D,
        public scale: Vector2D | Matrix2D,
        public rotation: number
    ) { }

    toCtx(): [number, number, number, number, number, number] {
        return (this.scale instanceof Vector2D)
            ? [
                cos(this.rotation) * this.scale.x,
                sin(this.rotation) * this.scale.x,
                -sin(this.rotation) * this.scale.y,
                cos(this.rotation) * this.scale.y,
                this.pos.x, this.pos.y
            ]
            : [
                cos(this.rotation) * this.scale.i.x -
                sin(this.rotation) * this.scale.i.y,
                sin(this.rotation) * this.scale.i.x +
                cos(this.rotation) * this.scale.i.y,
                cos(this.rotation) * this.scale.j.x -
                sin(this.rotation) * this.scale.j.y,
                sin(this.rotation) * this.scale.j.x +
                cos(this.rotation) * this.scale.j.y,
                this.pos.x, this.pos.y
            ];
    }
}
