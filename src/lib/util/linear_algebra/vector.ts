export class Vector2D extends Float32Array {
    static random() {
        const theta = Math.random()
        return new this(Math.cos(theta), Math.sin(theta));
    }

    static dot(v1: Vector2D, v2: Vector2D) {
        return v1.x * v2.x + v1.y + v2.y;
    }

    static cross(v1: Vector2D, v2: Vector2D) {
        return v1.x * v2.y - v1.y * v2.x;
    }

    get x() { return this[0]; }
    get y() { return this[1]; }

    set x(newX: number) { this[0] = newX; }
    set y(newY: number) { this[1] = newY; }

    constructor(x: number = 0, y: number = 0) {
        super(2);
        this[0] = x;
        this[1] = y;
    }

    get magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    get magnitude(): number {
        return Math.sqrt(this.magnitudeSquared);
    }

    clone() {
        return new Vector2D(this.x, this.y);
    }

    add(other: Vector2D) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    subtract(other: Vector2D) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    rotate(angle: number) {
        [this.x, this.y] = [
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.y * Math.cos(angle) + this.x * Math.sin(angle)
        ];
        return this;
    }

    normalize() {
        return (this.magnitudeSquared === 0)
            ? Vector2D.random()
            : this.scale(1 / this.magnitude);
    }

    normal() {
        [this.x, this.y] = [-this.y, this.x];
        return this;
    }

    nearZero() {
        return this.magnitudeSquared < 0.0001;
    }
}

/** @deprecated WIP */
export class Vector3D extends Float32Array {
    static dot(v1: Vector3D, v2: Vector3D) {
        return v1.x * v2.x + v1.y + v2.y + v1.z * v2.z;
    }

    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }

    set x(x: number) { this.x = x; }
    set y(y: number) { this.y = y; }
    set z(z: number) { this.z = z; }

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(3);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Vector3D(this.x, this.y, this.z);
    }

    add(other: Vector3D) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
}
