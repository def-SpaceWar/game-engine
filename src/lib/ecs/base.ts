export class Entity {
    private map = new Map<string, Component>();
    id: number = -1;

    constructor(...components: Component[]) {
        const size = components.length;
        for (let i = 0; i < size; i++) this.add(components[i]);
    }

    add(c: Component) {
        this.map.set(c.constructor.name, c);
        c.entity = this;
    }

    remove(c: string) {
        const comp = this.map.get(c);
        if (!comp) return;
        this.map.delete(c);
        comp.entity = undefined;
    }

    get<T>(c: new (...args: any[]) => T): T | undefined {
        return this.map.get(c.name) as T | undefined;
    }

    reset() {
        for (const [key, _] of this.map.entries()) this.remove(key);
    }
}

export type Component = {
    entity?: Entity;
};

export class World {
    private entityCount = 0;
    private maxEntityCount = 0;
    private entities: (Entity | undefined)[] = [];

    constructor(...entities: Entity[]) {
        const size = entities.length;
        for (let i = 0; i < size; i++) this.add(entities[i]);
    }

    add(e: Entity) {
        if (this.entityCount === this.maxEntityCount) {
            e.id = this.maxEntityCount;
            this.maxEntityCount += 1;
            this.entityCount++;
            this.entities[e.id] = e;
            return;
        }

        for (let i = 0; i < this.maxEntityCount; i++) {
            if (this.entities[i] === undefined) {
                e.id = i;
                this.entities[i] = e;
                this.entityCount++;
                return;
            }
        }
    }

    destroy(id: number) {
        const target = this.entities[id];
        if (!target) return;
        target.id = -1;
        target.reset();
        this.entities[id] = undefined;
        this.entityCount--;
    }

    get(id: number) {
        return this.entities[id];
    }

    *iterate(start = 0) {
        for (let i = start; i < this.maxEntityCount; i++) {
            const entity = this.entities[i];
            if (entity) yield entity;
        }
    }
}

export type Processor = (w: World) => void;
export type System = (w: World) => Command;

export type Scene = [() => World, System[], Processor[]]
export type Command
    = ["continue"]
    | ["stop"]
    | ["scene", number];
