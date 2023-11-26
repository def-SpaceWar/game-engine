import { Command, Entity, Processor, System, World } from "./ecs/base";

export class MonoScriptable {
    entity?: Entity;
    private map = new Map<string, Behavior>();

    constructor(...behaviors: Behavior[]) {
        const size = behaviors.length;
        for (let i = 0; i < size; i++) this.add(behaviors[i]);
    }

    add(b: Behavior) {
        this.map.set(b.constructor.name, b);
        b.monoScriptable = this;
    }

    remove(c: new (...args: any[]) => Behavior) {
        const name = c.name,
            comp = this.map.get(name);
        if (!comp) return;
        this.map.delete(name);
        comp.monoScriptable = undefined;
    }

    get<T extends Behavior>(c: new (...args: any[]) => T): T | undefined {
        return this.map.get(c.name) as T | undefined;
    }

    reset() {
        for (const [key, _] of this.map.entries()) this.map.delete(key);
    }

    *listAll() {
        for (const [key, _] of this.map.entries()) yield this.map.get(key)!;
    }
}

export abstract class Behavior {
    monoScriptable?: MonoScriptable;

    update(world: World): Command {
        return ["continue"];
        world;
    }

    process(world: World) {
        return;
        world;
    }
}

export const behaviorSystem: System = world => {
    for (const entity of world.iterate()) {
        const monoScriptable = entity.get(MonoScriptable);
        if (!monoScriptable) continue;
        for (const behavior of monoScriptable.listAll()) {
            const result = behavior.update(world);
            if (result[0] != "continue") return result;
        }
    }
    return ["continue"];
}

export const behaviorProcessor: Processor = world => {
    for (const entity of world.iterate()) {
        const monoScriptable = entity.get(MonoScriptable);
        if (!monoScriptable) continue;
        for (const behavior of monoScriptable.listAll()) behavior.process(world);
    }
}
