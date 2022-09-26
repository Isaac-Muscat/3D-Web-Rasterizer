import { Mat4, Vector3 } from "./Math.js";
import { makeNoise2D } from "./PerlinNoise.js";

export abstract class Mesh {
	private position: Vector3;
	private rotation: Vector3 = new Vector3();
	private scale: Vector3 = Vector3.ONE;
	private color: Vector3 = new Vector3(50, 200, 50);

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

	public sortTriangles(cameraPosition: Vector3): void {

	}

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

export class Triangle extends Mesh {
	private static readonly points: Vector3[] = [
		new Vector3(-0.5, 0,  0.5),
		new Vector3( 0.5, 0,  0.5),
		new Vector3( 0.5, 0, -0.5),
	];
	private static readonly triangle_indices: number[][] = [
		// Bottom Face
		[0, 1, 2]
	];

	get triangleIndices(): number[][] {
		return Triangle.triangle_indices;
	}
	get vertices(): Vector3[] {
		return Triangle.points;
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

export class Terrain extends Mesh {
	private points: Vector3[];
	private triangle_indices: number[][];
	private noise: (x: number, y: number) => number;

	constructor(
		x: number = 0, y: number = 0, z: number = 0, 
		private width: number 	= 10, 
		private length: number 	= 10, 
		private height: number 	= 1
	)
	{
		super(x, y, z);
		this.noise = makeNoise2D();
		this.points = [];
		this.triangle_indices = [];
		this.generateMesh();
	}

	get triangleIndices(): number[][] {
		return this.triangle_indices;
	}
	get vertices(): Vector3[] {
		return this.points;
	}

	public sortTriangles(cameraPosition: Vector3): void {
		const threeTimesCameraPos = cameraPosition.replicate().multiply(3);
		this.triangle_indices.sort((t1, t2) => {
			const distance1 = (
				Vector3.ZERO.
				add(this.points[t1[0]]).
				add(this.points[t1[1]]).
				add(this.points[t1[2]]).
				subtract(threeTimesCameraPos).mag()
			) / 3;
			const distance2 = (
				Vector3.ZERO.
				add(this.points[t2[0]]). 
				add(this.points[t2[1]]).
				add(this.points[t2[2]]).
				subtract(threeTimesCameraPos).mag()
			) / 3;
			return distance2 - distance1;
		});
	}

	private generateMesh(): void {
		// Generate all vertices
		for(let row = 0; row < this.length; row++) {
			for(let col = 0; col < this.width; col++) {
				this.points.push(new Vector3(col, this.height * (this.noise((col) / this.width  + this.Position.x, (row) / this.length  + this.Position.z) * 0.5 + 1), - row));
			}
		}

		// Generate all indices
		for(let row = 0; row < this.length - 1; row++) {
			for(let col = 0; col < this.width - 1; col++) {
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