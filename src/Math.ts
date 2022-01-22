export class Vector3 {
	private _x: number;
	private _y: number;
	private _z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0){
		this._x = x;
		this._y = y;
		this._z = z;
	}

	public replicate(): Vector3 {
		return new Vector3(
			this._x,
			this._y,
			this._z
		);
	}

	static get UP(): Vector3 {
		return new Vector3(0.0, 1.0, 0.0);
	}

	static get ONE(): Vector3 {
		return new Vector3(1.0, 1.0, 1.0);
	}

	public at(i: number): number {
		if(i == 0) return this._x;
		if(i == 1) return this._y;
		if(i == 2) return this._z;
		console.trace("Vector3 index out of bounds.");
		return 0;
	}

	public get x(): number {
		return this._x;
	}
	public get y(): number {
		return this._y;
	}
	public get z(): number {
		return this._z;
	}

	public mag(): number {
		return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
	}

	public add(v2: Vector3): Vector3 {
		this._x += v2.x;
		this._y += v2.y;
		this._z += v2.z;
		return this;
	}

	public subtract(v2: Vector3): Vector3 {
		this._x -= v2.x;
		this._y -= v2.y;
		this._z -= v2.z;
		return this;
	}

	public multiply(s: number): Vector3 {
		this._x *= s;
		this._y *= s;
		this._z *= s;
		return this;
	}


	public divide(s: number): Vector3 {
		if(s == 0) {
			console.trace("Vector3 divide by zero.");
			return this;
		}
		this._x /= s;
		this._y /= s;
		this._z /= s;
		return this;
	}

	public normalize(): Vector3 {
		return this.divide(this.mag());
	}

	public static cross(v1: Vector3, v2: Vector3): Vector3 {
		return new Vector3(
			v1.y * v2.z - v1.z * v2.y,
			v1.z * v2.x - v1.x * v2.z,
			v1.x * v2.y - v1.y * v2.x,
		  );
	}

	public static dot(v1: Vector3, v2: Vector3): number {
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
	}

	public static subtract(v1: Vector3, v2: Vector3): Vector3 {
		return new Vector3(
			v1.x - v2.x,
			v1.y - v2.y,
			v1.z - v2.z
		);
	}

	public static calculateNormal(v1: Vector3, v2: Vector3, v3: Vector3): Vector3 {
		const l1 = Vector3.subtract(v2, v1);
		const l2 = Vector3.subtract(v3, v1);
		return Vector3.cross(l1, l2).normalize();
	}
}

export class Mat4 {
	constructor(
		private m: number[][] = [
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1],
	]){
		this.m = m;
	}

	public getMat(): number[][] {
		return this.m;
	}

	public set(row: number, col: number, value: number): void {
		this.m[row][col] = value;
	}

	public get(row: number, col: number): number {
		return this.m[row][col];
	}

	public matVecMultiply(v: Vector3): Vector3 {
		const x: number = this.m[0][0] * v.x + this.m[0][1] * v.y + this.m[0][2] * v.z + this.m[0][3];
		const y: number = this.m[1][0] * v.x + this.m[1][1] * v.y + this.m[1][2] * v.z + this.m[1][3];
		const z: number = this.m[2][0] * v.x + this.m[2][1] * v.y + this.m[2][2] * v.z + this.m[2][3];
		const w: number = this.m[3][0] * v.x + this.m[3][1] * v.y + this.m[3][2] * v.z + this.m[3][3];

		if (w != 0) return new Vector3(x / w, y / w, z / w);
		else return new Vector3(x, y, z);
		
	}

	public matMatMultiply(multMat: Mat4): Mat4 {
		const m1: number[][] = this.m;
		const m2: number[][] = multMat.getMat();
		let m: number[][] = [
			[
				m1[0][0]*m2[0][0] + m1[0][1]*m2[1][0] + m1[0][2]*m2[2][0] + m1[0][3]*m2[3][0],
				m1[0][0]*m2[0][1] + m1[0][1]*m2[1][1] + m1[0][2]*m2[2][1] + m1[0][3]*m2[3][1],
				m1[0][0]*m2[0][2] + m1[0][1]*m2[1][2] + m1[0][2]*m2[2][2] + m1[0][3]*m2[3][2],
				m1[0][0]*m2[0][3] + m1[0][1]*m2[1][3] + m1[0][2]*m2[2][3] + m1[0][3]*m2[3][3],
			],
			[
				m1[1][0]*m2[0][0] + m1[1][1]*m2[1][0] + m1[1][2]*m2[2][0] + m1[1][3]*m2[3][0],
				m1[1][0]*m2[0][1] + m1[1][1]*m2[1][1] + m1[1][2]*m2[2][1] + m1[1][3]*m2[3][1],
				m1[1][0]*m2[0][2] + m1[1][1]*m2[1][2] + m1[1][2]*m2[2][2] + m1[1][3]*m2[3][2],
				m1[1][0]*m2[0][3] + m1[1][1]*m2[1][3] + m1[1][2]*m2[2][3] + m1[1][3]*m2[3][3],
			],
			[
				m1[2][0]*m2[0][0] + m1[2][1]*m2[1][0] + m1[2][2]*m2[2][0] + m1[2][3]*m2[3][0],
				m1[2][0]*m2[0][1] + m1[2][1]*m2[1][1] + m1[2][2]*m2[2][1] + m1[2][3]*m2[3][1],
				m1[2][0]*m2[0][2] + m1[2][1]*m2[1][2] + m1[2][2]*m2[2][2] + m1[2][3]*m2[3][2],
				m1[2][0]*m2[0][3] + m1[2][1]*m2[1][3] + m1[2][2]*m2[2][3] + m1[2][3]*m2[3][3],
			],
			[
				m1[3][0]*m2[0][0] + m1[3][1]*m2[1][0] + m1[3][2]*m2[2][0] + m1[3][3]*m2[3][0],
				m1[3][0]*m2[0][1] + m1[3][1]*m2[1][1] + m1[3][2]*m2[2][1] + m1[3][3]*m2[3][1],
				m1[3][0]*m2[0][2] + m1[3][1]*m2[1][2] + m1[3][2]*m2[2][2] + m1[3][3]*m2[3][2],
				m1[3][0]*m2[0][3] + m1[3][1]*m2[1][3] + m1[3][2]*m2[2][3] + m1[3][3]*m2[3][3],
			],
		];

		return new Mat4(m);
	}
}

export const clamp = (num:number, min: number, max: number) => Math.min(Math.max(num, min), max);