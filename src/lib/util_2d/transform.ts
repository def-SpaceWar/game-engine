import { Entity } from "../ecs/base";
import { Matrix2D } from "./linear_algebra/matrix";
import { Vector2D } from "./linear_algebra/vector";

export class Transform2D {
    entity?: Entity;

    constructor(public pos: Vector2D, public scale: Vector2D | Matrix2D, public rotation: number) { }

    toCtx(): [number, number, number, number, number, number] {
        return (this.scale instanceof Vector2D)
            ? [
                Math.cos(this.rotation) * this.scale.x,
                Math.sin(this.rotation) * this.scale.x,
                -Math.sin(this.rotation) * this.scale.y,
                Math.cos(this.rotation) * this.scale.y,
                this.pos.x, this.pos.y
            ]
            : [
                Math.cos(this.rotation) * this.scale.i.x -
                Math.sin(this.rotation) * this.scale.i.y,
                Math.sin(this.rotation) * this.scale.i.x +
                Math.cos(this.rotation) * this.scale.i.y,
                Math.cos(this.rotation) * this.scale.j.x -
                Math.sin(this.rotation) * this.scale.j.y,
                Math.sin(this.rotation) * this.scale.j.x +
                Math.cos(this.rotation) * this.scale.j.y,
                this.pos.x, this.pos.y
            ];
    }
}
