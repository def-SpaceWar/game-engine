import { Entity } from "../ecs/base";
import { Vector2D } from "../util/linear_algebra/vector";
import { C2DColor } from "./color";

export type C2DRenderInfo
	= [zIndex: number, type: "rect", x: number, y: number, w: number, h: number, c: C2DColor]
	| [zIndex: number, type: "ellipse", x: number, y: number, w: number, h: number, c: C2DColor]
	| [zIndex: number, type: "polygon", points: Vector2D[], c: C2DColor];

export class C2DRender {
    entity?: Entity;
    public renders: C2DRenderInfo[];

    constructor(...renders: C2DRenderInfo[]) {
        this.renders = renders;
    }
}
