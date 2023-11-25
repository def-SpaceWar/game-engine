import { C2DColor } from "../lib/canvas2d/fill";
import { C2DRender } from "../lib/canvas2d/render";
import { createC2DRenderProcessor } from "../lib/canvas2d/processor";
import { Entity, Scene, System, World } from "../lib/ecs/base";
import { dt } from "../lib/ecs/loop";
import { entityTree } from "../lib/hierarchy/tree";
import { Matrix2D } from "../lib/util_2d/linear_algebra/matrix";
import { Vector2D } from "../lib/util_2d/linear_algebra/vector";
import { Transform2D } from "../lib/util_2d/transform";
import { Input } from "../lib/ecs/input";

function testWorld() {
    const world = new World();

    const player = new Entity(
        new C2DRender(
            [0, 'rect', -50, -100, 100, 200, new C2DColor(255, 100, 0)],
        ),
        new Transform2D(
            new Vector2D(200, 200),
            new Matrix2D(new Vector2D(2, -1), new Vector2D(1, 1)),
            0,
        )
    );

    const gun = new Entity(
        new C2DRender(
            [-1, 'rect', -50, -50, 100, 100, new C2DColor(0, 255, 0)],
            [-1, 'polygon', [
                new Vector2D(-50, -50),
                new Vector2D(-50, 50),
                new Vector2D(25 * Math.sqrt(3), 0)
            ], new C2DColor(0, 100, 255)],
            [-1, 'polygon', [
                new Vector2D(50, -50),
                new Vector2D(50, 50),
                new Vector2D(-25 * Math.sqrt(3), 0)
            ], new C2DColor(255, 0, 100)],
        ),
        new Transform2D(
            new Vector2D(0, 0),
            new Matrix2D(new Vector2D(1 / 3, 1 / 3), new Vector2D(-1 / 3, 2 / 3)),
            0,
        )
    );

    world.add(player);
    world.add(gun);
    entityTree(world, player.id, gun.id);

    return world;
}

const testSystem = (): System => {
    let frame = 0;
    return w => {
        w.get(0)!.get(Transform2D)!.rotation += Input.key("a") ? 5 * dt : -5 * dt;

        if (frame % 100 === 0) w.add(
            new Entity(
                new Transform2D(
                    new Vector2D(Math.random() * 800, Math.random() * 600),
                    new Vector2D(1, 1),
                    0
                ),
                new C2DRender([
                    Math.random() * 10,
                    'ellipse',
                    -100, -75,
                    200, 150,
                    C2DColor.random()
                ])
            )
        );

        return (frame++ < 1000)
            ? ["continue"]
            : ["stop"];
    }
}

export default [
    testWorld,
    [testSystem()],
    [createC2DRenderProcessor(true)]
] as Scene;
