import { Processor } from "../ecs/base";
import { C2DRender, C2DRenderInfo } from "./components";

export function createRenderProcessor(hierarchy = false): Processor {
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
	`;
    return hierarchy
        ? world => {
            // TODO: CHANGE
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, 800, 600);
            let renderables: C2DRenderInfo[] = [];
            for (const entity of world.iterate()) {
                const c2dRender = entity.get(C2DRender);
                if (c2dRender) renderables = renderables.concat(c2dRender.renders);
            }
            renderables.sort((a, b) => b[0] - a[0]);
            const size = renderables.length;
            for (let i = 0, render = renderables[i]; i < size; i++)
                switch (render[1]) {
                    case "rect":
                        ctx.fillStyle = render[6].toCanvas();
                        ctx.fillRect(render[2], render[3], render[4], render[5]);
                        break;
                    case "ellipse":
                        ctx.fillStyle = render[6].toCanvas();
                        ctx.beginPath();
                        ctx.ellipse(render[2], render[3], render[4], render[5], 0, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case "polygon":
                        ctx.fillStyle = render[3].toCanvas();
                        const points = render[2],
                            pointsSize = points.length;
                        ctx.beginPath();
                        ctx.moveTo(points[pointsSize - 1].x, points[pointsSize - 1].y);
                        for (let i = 0, point = points[i]; i < pointsSize; i++) ctx.lineTo(point.x, point.y);
                        ctx.fill();
                        break;
                }
        }
        : world => {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, 800, 600);
            let renderables: C2DRenderInfo[] = [];
            for (const entity of world.iterate()) {
                const c2dRender = entity.get(C2DRender);
                if (c2dRender) renderables = renderables.concat(c2dRender.renders);
            }
            renderables.sort((a, b) => b[0] - a[0]);
            const size = renderables.length;
            for (let i = 0, render = renderables[i]; i < size; i++)
                switch (render[1]) {
                    case "rect":
                        ctx.fillStyle = render[6].toCanvas();
                        ctx.fillRect(render[2], render[3], render[4], render[5]);
                        break;
                    case "ellipse":
                        ctx.fillStyle = render[6].toCanvas();
                        ctx.beginPath();
                        ctx.ellipse(render[2], render[3], render[4], render[5], 0, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case "polygon":
                        ctx.fillStyle = render[3].toCanvas();
                        const points = render[2],
                            pointsSize = points.length;
                        ctx.beginPath();
                        ctx.moveTo(points[pointsSize - 1].x, points[pointsSize - 1].y);
                        for (let i = 0, point = points[i]; i < pointsSize; i++) ctx.lineTo(point.x, point.y);
                        ctx.fill();
                        break;
                }
        }
}
