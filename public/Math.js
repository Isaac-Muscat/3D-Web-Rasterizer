export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    replicate() {
        return new Vector3(this._x, this._y, this._z);
    }
    static get ZERO() {
        return new Vector3(0.0, 0.0, 0.0);
    }
    static get UP() {
        return new Vector3(0.0, 1.0, 0.0);
    }
    static get DOWN() {
        return new Vector3(0.0, -1.0, 0.0);
    }
    static get LEFT() {
        return new Vector3(-1.0, 0.0, 0.0);
    }
    static get RIGHT() {
        return new Vector3(1.0, 0.0, 0.0);
    }
    static get FORWARD() {
        return new Vector3(0.0, 0.0, 1.0);
    }
    static get BACK() {
        return new Vector3(0.0, 0.0, -1.0);
    }
    static get ONE() {
        return new Vector3(1.0, 1.0, 1.0);
    }
    at(i) {
        if (i == 0)
            return this._x;
        if (i == 1)
            return this._y;
        if (i == 2)
            return this._z;
        console.trace("Vector3 index out of bounds.");
        return 0;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get z() {
        return this._z;
    }
    set x(s) {
        this._x = s;
    }
    set y(s) {
        this._y = s;
    }
    set z(s) {
        this._z = s;
    }
    mag() {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
    }
    add(v2) {
        this._x += v2.x;
        this._y += v2.y;
        this._z += v2.z;
        return this;
    }
    subtract(v2) {
        this._x -= v2.x;
        this._y -= v2.y;
        this._z -= v2.z;
        return this;
    }
    multiply(s) {
        this._x *= s;
        this._y *= s;
        this._z *= s;
        return this;
    }
    divide(s) {
        if (s == 0) {
            console.trace("Vector3 divide by zero.");
            return this;
        }
        this._x /= s;
        this._y /= s;
        this._z /= s;
        return this;
    }
    normalize() {
        return this.divide(this.mag());
    }
    static normalize(v) {
        return v.replicate().normalize();
    }
    static cross(v1, v2) {
        return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static subtract(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static add(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static calculateNormal(v1, v2, v3) {
        const l1 = Vector3.subtract(v2, v1);
        const l2 = Vector3.subtract(v3, v1);
        return Vector3.cross(l1, l2).normalize();
    }
    static linePlaneIntersection(planePoint, planeNormal, lineStart, lineEnd) {
        const planeD = -Vector3.dot(planeNormal, planePoint);
        const ad = Vector3.dot(lineStart, planeNormal);
        const bd = Vector3.dot(lineEnd, planeNormal);
        const t = (-planeD - ad) / (bd - ad);
        const lineStartEnd = Vector3.subtract(lineEnd, lineStart);
        const lineIntersect = lineStartEnd.replicate().multiply(t);
        return Vector3.add(lineStart, lineIntersect);
    }
}
export class Mat4 {
    constructor(m = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]) {
        this.m = m;
        this.m = m;
    }
    getMat() {
        return this.m;
    }
    set(row, col, value) {
        this.m[row][col] = value;
    }
    get(row, col) {
        return this.m[row][col];
    }
    matVecMultiply(v) {
        const x = this.m[0][0] * v.x + this.m[0][1] * v.y + this.m[0][2] * v.z + this.m[0][3];
        const y = this.m[1][0] * v.x + this.m[1][1] * v.y + this.m[1][2] * v.z + this.m[1][3];
        const z = this.m[2][0] * v.x + this.m[2][1] * v.y + this.m[2][2] * v.z + this.m[2][3];
        const w = this.m[3][0] * v.x + this.m[3][1] * v.y + this.m[3][2] * v.z + this.m[3][3];
        if (w != 0)
            return new Vector3(x / w, y / w, z / w);
        else
            return new Vector3(x, y, z);
    }
    matMatMultiply(multMat) {
        const m1 = this.m;
        const m2 = multMat.getMat();
        let m = [
            [
                m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0] + m1[0][3] * m2[3][0],
                m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1] + m1[0][2] * m2[2][1] + m1[0][3] * m2[3][1],
                m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2] * m2[2][2] + m1[0][3] * m2[3][2],
                m1[0][0] * m2[0][3] + m1[0][1] * m2[1][3] + m1[0][2] * m2[2][3] + m1[0][3] * m2[3][3],
            ],
            [
                m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0] + m1[1][3] * m2[3][0],
                m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1] + m1[1][2] * m2[2][1] + m1[1][3] * m2[3][1],
                m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2] * m2[2][2] + m1[1][3] * m2[3][2],
                m1[1][0] * m2[0][3] + m1[1][1] * m2[1][3] + m1[1][2] * m2[2][3] + m1[1][3] * m2[3][3],
            ],
            [
                m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0] + m1[2][3] * m2[3][0],
                m1[2][0] * m2[0][1] + m1[2][1] * m2[1][1] + m1[2][2] * m2[2][1] + m1[2][3] * m2[3][1],
                m1[2][0] * m2[0][2] + m1[2][1] * m2[1][2] + m1[2][2] * m2[2][2] + m1[2][3] * m2[3][2],
                m1[2][0] * m2[0][3] + m1[2][1] * m2[1][3] + m1[2][2] * m2[2][3] + m1[2][3] * m2[3][3],
            ],
            [
                m1[3][0] * m2[0][0] + m1[3][1] * m2[1][0] + m1[3][2] * m2[2][0] + m1[3][3] * m2[3][0],
                m1[3][0] * m2[0][1] + m1[3][1] * m2[1][1] + m1[3][2] * m2[2][1] + m1[3][3] * m2[3][1],
                m1[3][0] * m2[0][2] + m1[3][1] * m2[1][2] + m1[3][2] * m2[2][2] + m1[3][3] * m2[3][2],
                m1[3][0] * m2[0][3] + m1[3][1] * m2[1][3] + m1[3][2] * m2[2][3] + m1[3][3] * m2[3][3],
            ],
        ];
        return new Mat4(m);
    }
}
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
