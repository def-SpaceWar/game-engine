export class Input {
    private static keys: string[] = [];
    private static _mouseX: number = Infinity;
    private static _mouseY: number = Infinity;
    private static _isMouseDown: boolean = false;

    static startKey() {
        addEventListener("keydown", this.keydown);
        addEventListener("keyup", this.keyup);
    }

    static startMouse() {
        addEventListener("mousemove", this.mousemove);
        addEventListener("mousedown", this.mousedown);
        addEventListener("mouseup", this.mouseup);
    }

    static startAll() {
        this.startKey();
        this.startMouse();
    }

    static stopKey() {
        removeEventListener("keydown", this.keydown);
        removeEventListener("keyup", this.keyup);
    }

    static stopMouse() {
        removeEventListener("mousemove", this.mousemove);
        removeEventListener("mousedown", this.mousedown);
        removeEventListener("mouseup", this.mouseup);
    }

    static stopAll() {
        this.stopKey();
        this.stopMouse();
    }

    private static keydown(e: KeyboardEvent) {
        if (!Input.key(e.key)) Input.keys.push(e.key);
    }

    private static keyup(e: KeyboardEvent) {
        for (let i = 0; i < Input.keys.length; i++) if (Input.keys[i] === e.key) return Input.keys.splice(i);
    }

    private static mousemove(e: MouseEvent) {
        Input._mouseX = e.clientX;
        Input._mouseY = e.clientY;
    }

    private static mousedown() {
        Input._isMouseDown = true;
    }

    private static mouseup() {
        Input._isMouseDown = false;
    }

    static get mouseX() { return this._mouseX; }
    static get mouseY() { return this._mouseY; }
    static get isMouseDown() { return this._isMouseDown; }

    static key(k: string) {
        for (let i = 0; i < this.keys.length; i++) if (this.keys[i] === k) return true;
        return false;
    }
}
