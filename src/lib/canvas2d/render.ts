import { Entity, Processor, World } from "../engine/base";
import { getAllParents } from "../hierarchy";
import { Vector2D } from "../util_2d/linear_algebra";
import { Transform2D } from "../util_2d/transform";
import { C2DFill } from "./fill";

export type C2DRenderInfo
    = [zIndex: number, type: "rect",
        x: number, y: number,
        w: number, h: number,
        c: C2DFill]
    | [zIndex: number, type: "ellipse",
        x: number, y: number,
        w: number, h: number,
        c: C2DFill, rotation: number]
    | [zIndex: number, type: "polygon",
        points: Vector2D[],
        c: C2DFill]
    | [zIndex: number, type: "image-",
        x: number, y: number,
        img: CanvasImageSource]
    | [zIndex: number, type: "image",
        x: number, y: number,
        w: number, h: number,
        img: CanvasImageSource]
    | [zIndex: number, type: "image+",
        x: number, y: number,
        w: number, h: number,
        sx: number, sy: number,
        sw: number, sh: number,
        img: CanvasImageSource];

export class C2DRender {
    entity?: Entity;
    public renders: C2DRenderInfo[];

    constructor(...renders: C2DRenderInfo[]) {
        this.renders = renders;
    }
}

function fpsCounter<T>(f: (arg: T) => void) {
    const fps = document.getElementById("app")!
        .appendChild(document.createElement("p")),
        fpses: number[] = [];

    let before = performance.now();
    return (arg: T) => {
        f(arg);
        const now = performance.now();
        fpses.push(1000 / (now - before));
        while (fpses.length > 100) fpses.shift();
        fps.innerText = "FPS: " + Math.round(fpses.reduce((acc, v) => acc + v) / fpses.length * 100) / 100;
        before = now;
    }
}

function getRenderables(world: World) {
    const renderables: [Entity, C2DRenderInfo][] = [];
    for (const entity of world.iterate()) {
        const c2dRender = entity.get(C2DRender);
        if (!c2dRender) continue;
        const renderSize = c2dRender?.renders.length;
        for (let i = 0; i < renderSize; i++) renderables.push([
            entity,
            c2dRender.renders[i]
        ]);
    }
    renderables.sort((a, b) => b[1][0] - a[1][0]);
    return renderables;
}

export function createC2DRenderProcessor(
    hierarchy = false,
    fallback: Processor = _ => { }
): Processor {
    const canvas = document.getElementById("app")!
        .appendChild(document.createElement("canvas")),
        ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Browser does not support CanvasRenderingContext2D!");
        return fallback;
    }

    canvas.width = 800;
    canvas.height = 600;
    (canvas as unknown as { style: string }).style = `
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #000;
	`;

    const draw = (render: C2DRenderInfo) => {
        switch (render[1]) {
            case "rect":
                ctx.fillStyle = render[6].toCanvas(ctx);
                ctx.fillRect(render[2], render[3], render[4], render[5]);
                break;
            case "ellipse":
                ctx.fillStyle = render[6].toCanvas(ctx);
                ctx.beginPath();
                ctx.ellipse(
                    render[2], render[3],
                    render[4], render[5],
                    render[7], 0, Math.PI * 2
                );
                ctx.fill();
                break;
            case "polygon":
                ctx.fillStyle = render[3].toCanvas(ctx);
                const points = render[2],
                    pointsSize = points.length;
                ctx.beginPath();
                ctx.moveTo(
                    points[pointsSize - 1].x, points[pointsSize - 1].y
                );
                for (let i = 0; i < pointsSize; i++) {
                    const point = points[i];
                    ctx.lineTo(point.x, point.y);
                }
                ctx.closePath();
                ctx.fill();
                break;
            case "image-":
                ctx.drawImage(render[4], render[2], render[3]);
                break;
            case "image":
                ctx.drawImage(render[6], render[2], render[3], render[4], render[5]);
                break;
            case "image+":
                ctx.drawImage(
                    render[10],
                    render[6], render[7],
                    render[8], render[9],
                    render[2], render[3],
                    render[4], render[5],
                );
                break;
        }
    }

    return hierarchy
        ? fpsCounter(world => {
            ctx.clearRect(0, 0, 800, 600);
            const renderables = getRenderables(world),
                renderablesSize = renderables.length;
            for (let i = 0; i < renderablesSize; i++) {
                const entity = renderables[i][0],
                    render = renderables[i][1];
                ctx.save();
                const entityChain = [entity];
                for (const parent of getAllParents(world, entity))
                    entityChain.unshift(parent);
                const chainSize = entityChain.length;
                for (let i = 0; i < chainSize; i++) {
                    const transform = entityChain[i].get(Transform2D);
                    if (transform) ctx.transform(...transform.toCtx());
                }
                draw(render);
                ctx.restore();
            }
        })
        : fpsCounter(world => {
            ctx.clearRect(0, 0, 800, 600);
            const renderables = getRenderables(world),
                renderablesSize = renderables.length;
            for (let i = 0; i < renderablesSize; i++) {
                const entity = renderables[i][0],
                    render = renderables[i][1];
                ctx.save();
                const transform = entity.get(Transform2D);
                if (transform) ctx.transform(...transform.toCtx());
                draw(render);
                ctx.restore();
            }
       })
}
