export class Entity {
    public id: number = -1;
    private map = new Map<string, Component>();

    constructor(...components: Component[]) {
        const size = components.length;
        for (let i = 0; i < size; i++) this.add(components[i]);
    }

    add(c: Component) {
        this.map.set(c.constructor.name, c);
        c.entity = this;
    }

    remove(c: string) { this.map.delete(c); }

    get<T>(c: string): T | undefined {
        return this.map.get(c) as T | undefined;
    }

    /**
     * @deprecated It's less performant than `.get("Component")`, only use for
     * testing.
     */
    $get<T>(c: new (...args: any[]) => T): T | undefined {
        return this.get(c.name);
    }
}

export type Component = {
    entity: Entity;
}

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

    remove(id: number) {
        const target = this.entities[id];
        if (!target) return;
        target.id = -1;
        this.entities[id] = undefined;
        this.entityCount--;
    }

    get(id: number) {
        return this.entities[id];
    }
}

/** Stuff like rendering systems. */
export type Processor = (w: World) => void;
/** Transformations that modify the world's state. */
export type System = (w: World) => Command;
export type Command
    = ["continue"]
    | ["stop"]
    | ["world", number];
