import { Mat4, Vector3 } from "./Math.js";
export class Mesh {
    constructor(x = 0, y = 0, z = 0) {
        this.rotation = new Vector3();
        this.scale = Vector3.ONE;
        this.color = new Vector3(0, 150, 255);
        this.position = new Vector3(x, y, z);
    }
    get Rotation() {
        return this.rotation;
    }
    get Position() {
        return this.position;
    }
    get Scale() {
        return this.scale;
    }
    get Color() {
        return this.color;
    }
    setColor(r, g, b) {
        this.color = new Vector3(r, g, b);
    }
    getModelMatrix() {
        const translation = new Mat4([
            [this.scale.x, 0, 0, this.position.x],
            [0, this.scale.y, 0, this.position.y],
            [0, 0, this.scale.z, this.position.z],
            [0, 0, 0, 1],
        ]);
        const cosY = Math.cos(this.rotation.y);
        const sinY = Math.sin(this.rotation.y);
        const yRotation = new Mat4([
            [cosY, 0, -sinY, 0],
            [0, 1, 0, 0],
            [sinY, 0, cosY, 0],
            [0, 0, 0, 1],
        ]);
        const cosX = Math.cos(this.rotation.x);
        const sinX = Math.sin(this.rotation.x);
        const xRotation = new Mat4([
            [1, 0, 0, 0],
            [0, cosX, -sinX, 0],
            [0, sinX, cosX, 0],
            [0, 0, 0, 1],
        ]);
        return translation.matMatMultiply(xRotation.matMatMultiply(yRotation));
    }
}
export class Cube extends Mesh {
    get triangleIndices() {
        return Cube.triangle_indices;
    }
    get vertices() {
        return Cube.points;
    }
}
Cube.points = [
    new Vector3(-0.5, -0.5, 0.5),
    new Vector3(-0.5, 0.5, 0.5),
    new Vector3(0.5, 0.5, 0.5),
    new Vector3(0.5, -0.5, 0.5),
    new Vector3(-0.5, -0.5, -0.5),
    new Vector3(-0.5, 0.5, -0.5),
    new Vector3(0.5, 0.5, -0.5),
    new Vector3(0.5, -0.5, -0.5),
];
Cube.triangle_indices = [
    // Front Face
    [2, 1, 0],
    [3, 2, 0],
    // Right Face
    [6, 2, 3],
    [7, 6, 3],
    // Back Face
    [5, 6, 7],
    [4, 5, 7],
    // Left Face
    [1, 5, 4],
    [0, 1, 4],
    // Top Face
    [6, 5, 1],
    [2, 6, 1],
    // Bottom Face
    [3, 0, 4],
    [7, 3, 4],
];
export class Plane extends Mesh {
    get triangleIndices() {
        return Plane.triangle_indices;
    }
    get vertices() {
        return Plane.points;
    }
}
Plane.points = [
    new Vector3(-0.5, 0, 0.5),
    new Vector3(0.5, 0, 0.5),
    new Vector3(-0.5, 0, -0.5),
    new Vector3(0.5, 0, -0.5),
];
Plane.triangle_indices = [
    // Bottom Face
    [0, 1, 3],
    [0, 3, 2],
];
