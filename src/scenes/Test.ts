import { SolidColor } from "../lib/canvas2d/color";
import { C2DRender } from "../lib/canvas2d/components";
import { createRenderProcessor } from "../lib/canvas2d/processor";
import { Entity, Scene, System, World } from "../lib/ecs/base";
import { entityTree } from "../lib/hierarchy/tree";

function testWorld() {
    const player = new Entity(
        new C2DRender(
            [0, 'rect', 0, 0, 100, 200, new SolidColor(255, 100, 0)]
        )
    );
    const gun = new Entity,
        world = new World(player, gun);
    entityTree(world, player.id, gun.id);
    return world;
}

let frame = 0;
const testSystem: System = () => (frame++ < 100)
    ? ["continue"]
    : ["stop"];

export default [testWorld, [testSystem], [createRenderProcessor()]] as Scene;
