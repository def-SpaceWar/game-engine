import { Entity, Processor, System, World } from './lib/ecs/base';
import { dt, initEngine } from './lib/ecs/loop';
import { entityTree } from './lib/ecs/prelude';
import './style.css';

const player = new Entity,
    gun = new Entity,
    world = new World(player, gun),
    testSystem: System = _ => {
        console.log(dt);
        return ["stop"];
    },
    testProcessor: Processor = world => {
        console.log(world.get(0));
    };

entityTree(player, gun);
initEngine([world], [testSystem], [testProcessor]);
