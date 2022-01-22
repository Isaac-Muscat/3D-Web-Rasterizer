import { Mat4, Vector3 } from "./Math.js";

export abstract class Mesh {
	private position: Vector3;
	private rotation: Vector3 = new Vector3();
	private scale: Vector3 = Vector3.ONE;
	private color: Vector3 = new Vector3(0, 150, 255);

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.position = new Vector3(x, y, z);
	}

	get Rotation(): Vector3 {
		return this.rotation;
	}

	get Position(): Vector3 {
		return this.position;
	}

	get Scale(): Vector3 {
		return this.scale;
	}

	get Color(): Vector3 {
		return this.color;
	}

	public setColor(r: number, g: number, b: number): void {
		this.color = new Vector3(r, g, b);
	}

	abstract get triangleIndices(): number[][];
	abstract get vertices(): Vector3[];

	public getModelMatrix(): Mat4 {
		const translation = new Mat4([
			[this.scale.x, 0, 0, this.position.x],
			[0 , this.scale.y, 0, this.position.y],
			[0, 0, this.scale.z, this.position.z],
			[0, 0, 0, 1],
		]);

		const cosY = Math.cos(this.rotation.y);
		const sinY = Math.sin(this.rotation.y);
		const yRotation = new Mat4([
			[cosY, 	0, 	-sinY, 	0],
			[0, 	1, 	0, 		0],
			[sinY, 	0, 	cosY, 	0],
			[0, 	0, 	0, 		1],
		]);

		const cosX = Math.cos(this.rotation.x);
		const sinX = Math.sin(this.rotation.x);
		const xRotation = new Mat4([
			[1, 	0, 		0, 		0],
			[0, 	cosX, 	-sinX, 	0],
			[0, 	sinX, 	cosX, 	0],
			[0, 	0, 		0, 		1],
		]);

		return translation.matMatMultiply(xRotation.matMatMultiply(yRotation));
	}
}

export class Cube extends Mesh {
	private static readonly points: Vector3[] = [
		new Vector3(-0.5, -0.5,  0.5),
		new Vector3(-0.5,  0.5,  0.5),
		new Vector3( 0.5,  0.5,  0.5),
		new Vector3( 0.5, -0.5,  0.5),
		new Vector3(-0.5, -0.5, -0.5),
		new Vector3(-0.5,  0.5, -0.5),
		new Vector3( 0.5,  0.5, -0.5),
		new Vector3( 0.5, -0.5, -0.5),
	];
	private static readonly triangle_indices: number[][] = [
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

	get triangleIndices(): number[][] {
		return Cube.triangle_indices;
	}
	get vertices(): Vector3[] {
		return Cube.points;
	}
}

export class Plane extends Mesh {
	private static readonly points: Vector3[] = [
		new Vector3(-0.5, 0,  0.5),
		new Vector3( 0.5, 0,  0.5),
		new Vector3(-0.5, 0, -0.5),
		new Vector3( 0.5, 0, -0.5),
	];
	private static readonly triangle_indices: number[][] = [
		// Bottom Face
		[0, 1, 3],
		[0, 3, 2],
	];

	get triangleIndices(): number[][] {
		return Plane.triangle_indices;
	}
	get vertices(): Vector3[] {
		return Plane.points;
	}
}