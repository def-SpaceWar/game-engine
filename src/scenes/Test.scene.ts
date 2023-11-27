import { C2DColor } from "../lib/canvas2d/fill";
import { C2DRender, createC2DRenderProcessor } from "../lib/canvas2d/render";
import { Entity, Scene, System, World } from "../lib/engine/base";
import { enforceHierarchy } from "../lib/hierarchy";
import { Vector2D, Matrix2D } from "../lib/util_2d/linear_algebra";
import { Transform2D } from "../lib/util_2d/transform";
import { MonoScriptable, behaviorSystem } from "../lib/behavior";
import TestBehavior from "../behaviors/Test.behavior";

function testWorld() {
    const world = new World();

    const player = new Entity(
        new C2DRender(
            [0, 'rect', -50, -100, 100, 200, new C2DColor(255, 100, 0)],
        ),
        new Transform2D(
            new Vector2D(200, 200),
            new Matrix2D(2, 1, -1, 1),
            0,
        ),
        new MonoScriptable(
            new TestBehavior(10),
        ),
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
            new Matrix2D(
                1 / 3, -1 / 3,
                1 / 3, 2 / 3
            ),
            0,
        )
    );

    world.add(player);
    world.add(gun);
    enforceHierarchy(world, player.id, gun.id);

    return world;
}

function testSystem(): System {
    let frame = 0;
    return w => {
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
                    C2DColor.random(), 0,
                ]),
            ),
        );

        return (frame++ < 1000)
            ? ["continue"]
            : ["stop"];
    }
}

export default [
    testWorld,
    [testSystem(), behaviorSystem],
    [createC2DRenderProcessor(true)]
] as Scene;
