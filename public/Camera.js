import { Mat4, Vector3, clamp } from "./Math.js";
export class Camera {
    constructor(screenWidth, screenHeight, fov, nearPlane, farPlane, position) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.fov = fov;
        this.nearPlane = nearPlane;
        this.farPlane = farPlane;
        this.position = position;
        this.up = Vector3.UP;
        this.forward = new Vector3(0.0, 0.0, -1.0);
        this.yaw = -90.0;
        this.pitch = 0.0;
        this.zoom = 1.0;
        this.mouseSensitivity = 0.2;
        this.speed = 0.1;
        this.perspective = new Mat4();
        this.view = new Mat4();
        this.aspectRatio = screenWidth / screenHeight;
        this.right = Vector3.cross(this.up, this.forward);
        this.resetPerspectiveMatrix();
        this.resetViewMatrix();
    }
    get Position() {
        return this.position;
    }
    onKeyDown(e) {
        if (e.key == "w") {
            this.position.add(this.forward.replicate().multiply(this.speed));
            console.log(this.position);
        }
        else if (e.key == "s") {
            this.position.add(this.forward.replicate().multiply(-this.speed));
        }
        if (e.key == "a") {
            this.position.add(this.right.replicate().multiply(this.speed));
        }
        else if (e.key == "d") {
            this.position.add(this.right.replicate().multiply(-this.speed));
        }
        if (e.key == " ") {
            this.position.add(this.up.replicate().multiply(this.speed));
        }
        else if (e.key == "Shift") {
            this.position.add(this.up.replicate().multiply(-this.speed));
        }
        this.resetViewMatrix();
    }
    onMouseMove(e) {
        this.yaw += -(e.movementX) * this.mouseSensitivity * Math.PI / 180;
        this.pitch += -(e.movementY) * this.mouseSensitivity * Math.PI / 180;
        this.forward.x = Math.cos(this.yaw) * Math.cos(this.pitch);
        this.forward.y = Math.sin(this.pitch);
        this.forward.z = Math.sin(this.yaw) * Math.cos(this.pitch);
        this.forward.normalize();
        this.resetViewMatrix();
    }
    resetPerspectiveMatrix() {
        const fovRad = this.fov * Math.PI / 180;
        const S = 1 / Math.tan(fovRad * 0.5);
        const a11 = (S * this.zoom) / this.aspectRatio;
        const a22 = S;
        const a33 = this.farPlane / (this.farPlane - this.nearPlane);
        const a34 = (-this.farPlane * this.nearPlane) / (this.farPlane - this.nearPlane);
        const newPerspectiveMatrix = [
            [a11, 0, 0, 0],
            [0, a22, 0, 0],
            [0, 0, a33, a34],
            [0, 0, 1, 0],
        ];
        this.perspective = new Mat4(newPerspectiveMatrix);
    }
    resetViewMatrix() {
        const zaxis = this.forward.replicate().multiply(-1).normalize();
        this.right = Vector3.cross(Vector3.UP, zaxis).normalize();
        this.up = Vector3.cross(zaxis, this.right);
        let translation = new Mat4();
        translation.set(0, 3, -this.position.x); // Third column, first row
        translation.set(1, 3, -this.position.y);
        translation.set(2, 3, -this.position.z);
        let rotation = new Mat4();
        rotation.set(0, 0, this.right.x); // First column, first row
        rotation.set(0, 1, this.right.y);
        rotation.set(0, 2, this.right.z);
        rotation.set(1, 0, this.up.x); // First column, second row
        rotation.set(1, 1, this.up.y);
        rotation.set(1, 2, this.up.z);
        rotation.set(2, 0, zaxis.x); // First column, third row
        rotation.set(2, 1, zaxis.y);
        rotation.set(2, 2, zaxis.z);
        this.view = rotation.matMatMultiply(translation);
    }
    ndcToScreen(v) {
        return new Vector3((v.x + 1) * 0.5 * this.screenWidth, (v.y + 1) * 0.5 * this.screenHeight, v.z);
    }
    drawTriangle(context, v1, v2, v3, color) {
        context.strokeStyle = color;
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(v1.x, v1.y);
        context.lineTo(v2.x, v2.y);
        context.lineTo(v3.x, v3.y);
        context.lineTo(v1.x, v1.y);
        context.stroke();
        context.fill();
    }
    draw(context, mesh) {
        const model = mesh.getModelMatrix();
        for (const triangle of mesh.triangleIndices) {
            const v1 = model.matVecMultiply(mesh.vertices[triangle[0]]);
            const v2 = model.matVecMultiply(mesh.vertices[triangle[1]]);
            const v3 = model.matVecMultiply(mesh.vertices[triangle[2]]);
            // Calculate lighting for each triangle
            const normal = Vector3.calculateNormal(v1, v2, v3);
            const offset = Vector3.subtract(this.position, v1);
            if (Vector3.dot(normal, offset) > 0) {
                // Calculate final screen positions for each triangle
                const transform = this.perspective.matMatMultiply(this.view);
                const v1Final = this.ndcToScreen(transform.matVecMultiply(v1));
                const v2Final = this.ndcToScreen(transform.matVecMultiply(v2));
                const v3Final = this.ndcToScreen(transform.matVecMultiply(v3));
                // Lighting
                const dirLight = new Vector3(0, 1, 1);
                const intensity = clamp(Vector3.dot(dirLight, normal), 0, 1) + 0.2;
                const color = `rgb(
					${intensity * mesh.Color.x},
					${intensity * mesh.Color.y},
					${intensity * mesh.Color.z})`;
                this.drawTriangle(context, v1Final, v2Final, v3Final, color);
            }
        }
    }
}
