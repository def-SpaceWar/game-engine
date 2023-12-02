import { Command, Entity, Processor, System, World } from "./engine/base";

export class MonoScriptable {
    entity?: Entity;
    private map = new Map<string, Behavior>();

    constructor(...behaviors: Behavior[]) {
        const size = behaviors.length;
        for (let i = 0; i < size; i++) this.add(behaviors[i]);
    }

    add(behavior: Behavior) {
        this.map.set(behavior.constructor.name, behavior);
        behavior.monoScriptable = this;
    }

    remove(behavior: new (...args: any[]) => Behavior) {
        const name = behavior.name,
            behav = this.map.get(name);
        if (!behav) return;
        this.map.delete(name);
        behav.monoScriptable = undefined;
    }

    get<T extends Behavior>(behavior: new (...args: any[]) => T): T | undefined {
        return this.map.get(behavior.name) as T | undefined;
    }

    reset() {
        for (const [key, _] of this.map.entries()) this.map.delete(key);
    }

    *listAll() {
        for (const [key, _] of this.map.entries()) yield this.map.get(key)!;
    }
}

export type Behavior = {
    monoScriptable?: MonoScriptable;
    update?: (world: World) => Command;
    process?: (world: World) => void;
};

export type InitBehavior = {
    monoScriptable?: MonoScriptable;
    init(world: World): void;
    update(world: World): Command;
    process?: (world: World) => void;
};

export type SetupBehavior = {
    monoScriptable?: MonoScriptable;
    update?: (world: World) => Command;
    setup(world: World): void;
    process(world: World): void;
};

export function init<T extends new (...args: any[]) => InitBehavior>(constructor: T) {
    return class extends constructor {
        private hasInit = false;
        update(world: World) {
            if (!this.hasInit) {
                this.init(world);
                this.hasInit = true;
            }
            return super.update(world);
        }
    };
}

export function setup<T extends new (...args: any[]) => SetupBehavior>(constructor: T) {
    return class extends constructor {
        private hasSetup = false;
        process(world: World) {
            if (!this.hasSetup) {
                this.setup(world);
                this.hasSetup = true;
            }
            return super.process(world);
        }
    };
}

export const behaviorSystem: System = world => {
    for (const entity of world.iterate()) {
        const monoScriptable = entity.get(MonoScriptable);
        if (!monoScriptable) continue;
        for (const behavior of monoScriptable.listAll()) {
            if (!behavior.update) continue;
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
        for (const behavior of monoScriptable.listAll()) if (behavior.process)
            behavior.process(world);
    }
}
