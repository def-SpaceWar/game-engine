import { init, MonoScriptable } from "../lib/behavior";
import { Command, World } from "../lib/engine/base";
import { isKey } from "../lib/engine/input";
import { dt } from "../lib/engine/loop";
import { Transform2D } from "../lib/util_2d/transform";

@init
export default class {
    monoScriptable?: MonoScriptable;
    public transform?: Transform2D;

    constructor(public speed: number) { }

    init() {
        this.transform = this.monoScriptable!.entity!.get(Transform2D)!;
    }

    update(_: World): Command {
        this.transform!.rotation += dt * this.speed * (isKey("a") ? 1 : -1);
        return ["continue"];
    }
}
