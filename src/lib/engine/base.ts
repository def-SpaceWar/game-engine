export class Entity {
    private map = new Map<string, Component>();
    id: number = -1;

    constructor(...components: Component[]) {
        const size = components.length;
        for (let i = 0; i < size; i++) this.add(components[i]);
    }

    add(component: Component) {
        this.map.set(component.constructor.name, component);
        component.entity = this;
    }

    remove(component: new (...args: any[]) => Component) {
        const name = component.name,
            comp = this.map.get(name);
        if (!comp) return;
        this.map.delete(name);
        comp.entity = undefined;
    }

    get<T extends Component>(component: new (...args: any[]) => T): T | undefined {
        return this.map.get(component.name) as T | undefined;
    }

    reset() {
        for (const [key, _] of this.map.entries()) this.map.delete(key);
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

    add(entity: Entity) {
        if (this.entityCount === this.maxEntityCount) {
            entity.id = this.maxEntityCount;
            this.maxEntityCount += 1;
            this.entityCount++;
            this.entities[entity.id] = entity;
            return;
        }

        for (let i = 0; i < this.maxEntityCount; i++) {
            if (this.entities[i] === undefined) {
                entity.id = i;
                this.entities[i] = entity;
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
