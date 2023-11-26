const keys: string[] = [];
let _mouseX: number = Infinity,
    _mouseY: number = Infinity,
    _isMouseDown: boolean = false;

export function listenKeys() {
    addEventListener("keydown", keydown);
    addEventListener("keyup", keyup);
}

export function listenMouse() {
    addEventListener("mousemove", mousemove);
    addEventListener("mousedown", mousedown);
    addEventListener("mouseup", mouseup);
}

export function listenAll() {
    listenKeys();
    listenMouse();
}

export function removeKeys() {
    removeEventListener("keydown", keydown);
    removeEventListener("keyup", keyup);
}

export function removeMouse() {
    removeEventListener("mousemove", mousemove);
    removeEventListener("mousedown", mousedown);
    removeEventListener("mouseup", mouseup);
}

export function removeAll() {
    removeKeys();
    removeMouse();
}

function keydown(e: KeyboardEvent) {
    if (!isKey(e.key)) keys.push(e.key);
}

function keyup(e: KeyboardEvent) {
    for (let i = 0; i < keys.length; i++) if (keys[i] === e.key) return keys.splice(i);
}

function mousemove(e: MouseEvent) {
    _mouseX = e.clientX;
    _mouseY = e.clientY;
}

function mousedown() {
    _isMouseDown = true;
}

function mouseup() {
    _isMouseDown = false;
}

export function mouseX() { return _mouseX; }
export function mouseY() { return _mouseY; }
export function isMouseDown() { return _isMouseDown; }

export function isKey(k: string) {
    for (let i = 0; i < keys.length; i++) if (keys[i] === k) return true;
    return false;
}
