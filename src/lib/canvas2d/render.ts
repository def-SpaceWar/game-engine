import { Entity } from "../ecs/base";
import { Vector2D } from "../util_2d/linear_algebra/vector";
import { C2DFill } from "./fill";

export type C2DRenderInfo
	= [zIndex: number, type: "rect", x: number, y: number, w: number, h: number, c: C2DFill]
	| [zIndex: number, type: "ellipse", x: number, y: number, w: number, h: number, c: C2DFill]
	| [zIndex: number, type: "polygon", points: Vector2D[], c: C2DFill];

export class C2DRender {
    entity?: Entity;
    public renders: C2DRenderInfo[];

    constructor(...renders: C2DRenderInfo[]) {
        this.renders = renders;
    }
}
