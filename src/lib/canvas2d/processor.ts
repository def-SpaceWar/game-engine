import { Entity, Processor } from "../ecs/base";
import { getAllParents } from "../hierarchy/tree";
import { Transform2D } from "../util_2d/transform";
import { C2DRender, C2DRenderInfo } from "./render";

export function createC2DRenderProcessor(hierarchy = false): Processor {
    const canvas = document.getElementById("app")!.appendChild(document.createElement("canvas")),
        ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Browser does not support HTML canvas!");
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
                ctx.ellipse(render[2], render[3], render[4], render[5], 0, 0, Math.PI * 2);
                ctx.fill();
                break;
            case "polygon":
                ctx.fillStyle = render[3].toCanvas(ctx);
                const points = render[2],
                    pointsSize = points.length;
                ctx.beginPath();
                ctx.moveTo(points[pointsSize - 1].x, points[pointsSize - 1].y);
                for (let i = 0; i < pointsSize; i++) {
                    const point = points[i];
                    ctx.lineTo(point.x, point.y);
                }
                ctx.closePath();
                ctx.fill();
                break;
        }
    }

    return hierarchy
        ? world => {
            ctx.clearRect(0, 0, 800, 600);
            let renderables: [Entity, C2DRenderInfo][] = [];
            for (const entity of world.iterate()) {
                const c2dRender = entity.get(C2DRender);
                if (!c2dRender) continue;
                const renderSize = c2dRender.renders.length;
                for (let i = 0; i < renderSize; i++) renderables.push([entity, c2dRender.renders[i]]);
            }
            renderables.sort((a, b) => b[1][0] - a[1][0]);
            const renderablesSize = renderables.length;
            for (let i = 0; i < renderablesSize; i++) {
                const entity = renderables[i][0],
                    render = renderables[i][1];
                ctx.save();
                const entityChain = [entity];
                for (const parent of getAllParents(world, entity)) entityChain.unshift(parent);
                const chainSize = entityChain.length;
                for (let i = 0; i < chainSize; i++) {
                    const transform = entityChain[i].get(Transform2D);
                    if (transform) ctx.transform(...transform.toCtx());
                }
                draw(render);
                ctx.restore();
            }
        }
        : world => {
            ctx.clearRect(0, 0, 800, 600);
            let renderables: [Entity, C2DRenderInfo][] = [];
            for (const entity of world.iterate()) {
                const c2dRender = entity.get(C2DRender);
                if (!c2dRender) continue;
                const renderSize = c2dRender.renders.length;
                for (
                    let i = 0, render = c2dRender.renders[0];
                    i < renderSize;
                    i++, render = c2dRender.renders[i]
                ) {
                    renderables.push([entity, render]);
                }
            }
            renderables.sort((a, b) => b[1][0] - a[1][0]);
            const renderablesSize = renderables.length;
            for (let i = 0; i < renderablesSize; i++) {
                const entity = renderables[i][0],
                    render = renderables[i][1];
                ctx.save();
                const transform = entity.get(Transform2D);
                if (transform) ctx.transform(...transform.toCtx());
                draw(render);
                ctx.restore();
            }
        }
}
