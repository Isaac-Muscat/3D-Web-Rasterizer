import { Cube, Terrain } from "./Mesh.js";
import { Camera } from "./Camera.js";
import { Vector3 } from "./Math.js";
export class Scene {
    constructor() {
        this.prevTime = performance.now();
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const canvas = this.canvas;
        this.canvas.onclick = function () {
            canvas.requestPointerLock();
        };
        this.cube = new Cube(0, 0, 1);
        this.cube.setColor(0, 255, 0);
        this.meshes = [
            new Terrain(0, -6, 0, 20, 20, 2),
            new Terrain(-19, -6, 0, 20, 20, 2),
            new Terrain(0, -6, -19, 20, 20, 2),
            this.cube,
        ];
        this.camera = new Camera(this.canvas.width, this.canvas.height, 90.0, 0.05, 100, new Vector3(2.0, 0.0, 5.0));
    }
    static getScene() {
        return this.scene || (this.scene = new Scene());
    }
    update() {
        const curTime = performance.now();
        const deltaTime = curTime - this.prevTime;
        this.prevTime = curTime;
        const a = new Vector3(0.01, 0.002, 0);
        this.cube.Rotation.add(a);
    }
    draw() {
        this.context.fillStyle = `rgb(${100}, ${200}, ${255})`;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.meshes.sort((mesh1, mesh2) => {
            return Vector3.subtract(mesh2.Position, this.camera.Position).mag()
                - Vector3.subtract(mesh1.Position, this.camera.Position).mag();
        });
        for (const mesh of this.meshes) {
            this.camera.draw(this.context, mesh);
        }
    }
    onKeyDown(e) {
        this.camera.onKeyDown(e);
    }
    onMouseMove(e) {
        this.camera.onMouseMove(e);
    }
}
