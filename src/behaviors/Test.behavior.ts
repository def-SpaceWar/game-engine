import { init, MonoScriptable } from "../lib/behavior";
import { canvasPos } from "../lib/canvas2d/render";
import { Command, World } from "../lib/engine/base";
import { isKey, mouseX, mouseY } from "../lib/engine/input";
import { dt } from "../lib/engine/loop";
import { Vector2D } from "../lib/util_2d/linear_algebra";
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
        if (!this.transform) {
            console.error("Transform not found:", this.monoScriptable);
            return ["stop"];
        }
        this.transform.rotation += this.speed * dt * (isKey("a") ? 1 : -1);
        this.transform.position = new Vector2D(mouseX(), mouseY())
            .subtract(canvasPos());
        return ["continue"];
    }
}
