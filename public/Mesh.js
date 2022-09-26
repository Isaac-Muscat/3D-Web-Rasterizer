import { Mat4, Vector3 } from "./Math.js";
import { makeNoise2D } from "./PerlinNoise.js";
export class Mesh {
    constructor(x = 0, y = 0, z = 0) {
        this.rotation = new Vector3();
        this.scale = Vector3.ONE;
        this.color = new Vector3(50, 200, 50);
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
    sortTriangles(cameraPosition) {
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
export class Triangle extends Mesh {
    get triangleIndices() {
        return Triangle.triangle_indices;
    }
    get vertices() {
        return Triangle.points;
    }
}
Triangle.points = [
    new Vector3(-0.5, 0, 0.5),
    new Vector3(0.5, 0, 0.5),
    new Vector3(0.5, 0, -0.5),
];
Triangle.triangle_indices = [
    // Bottom Face
    [0, 1, 2]
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
export class Terrain extends Mesh {
    constructor(x = 0, y = 0, z = 0, width = 10, length = 10, height = 1) {
        super(x, y, z);
        this.width = width;
        this.length = length;
        this.height = height;
        this.noise = makeNoise2D();
        this.points = [];
        this.triangle_indices = [];
        this.generateMesh();
    }
    get triangleIndices() {
        return this.triangle_indices;
    }
    get vertices() {
        return this.points;
    }
    sortTriangles(cameraPosition) {
        const threeTimesCameraPos = cameraPosition.replicate().multiply(3);
        this.triangle_indices.sort((t1, t2) => {
            const distance1 = (Vector3.ZERO.
                add(this.points[t1[0]]).
                add(this.points[t1[1]]).
                add(this.points[t1[2]]).
                subtract(threeTimesCameraPos).mag()) / 3;
            const distance2 = (Vector3.ZERO.
                add(this.points[t2[0]]).
                add(this.points[t2[1]]).
                add(this.points[t2[2]]).
                subtract(threeTimesCameraPos).mag()) / 3;
            return distance2 - distance1;
        });
    }
    generateMesh() {
        // Generate all vertices
        for (let row = 0; row < this.length; row++) {
            for (let col = 0; col < this.width; col++) {
                this.points.push(new Vector3(col, this.height * (this.noise((col) / this.width + this.Position.x, (row) / this.length + this.Position.z) * 0.5 + 1), -row));
            }
        }
        // Generate all indices
        for (let row = 0; row < this.length - 1; row++) {
            for (let col = 0; col < this.width - 1; col++) {
                this.triangleIndices.push([
                    row * this.width + col,
                    row * this.width + col + 1,
                    row * this.width + col + 1 + this.width
                ]);
                this.triangleIndices.push([
                    row * this.width + col,
                    row * this.width + col + this.width + 1,
                    row * this.width + col + this.width,
                ]);
            }
        }
    }
}
