const object = [
  "v 1.000000 -1.000000 -1.000000",
  "v 1.000000 -1.000000 1.000000",
  "v -1.000000 0.568880 -0.568880",
  "v -1.000000 -0.568880 -0.568880",
  "v -1.000000 0.568880 0.568880",
  "v -1.000000 -0.568880 0.568880",
  "v -1.000000 -1.000000 -1.000000",
  "v -1.000000 -1.000000 1.000000",
  "v -1.000000 1.000000 1.000000",
  "v -1.000000 1.000000 -1.000000",
  "v -1.000000 -0.568880 -0.568880",
  "v -1.000000 -0.568880 0.568880",
  "v -1.000000 0.568880 0.568880",
  "v -1.000000 0.568880 -0.568880",
  "v -2.296778 -0.568880 -0.568880",
  "v -2.296778 -0.568880 0.568880",
  "v -2.296778 0.568880 0.568880",
  "v -2.296778 0.568880 -0.568880",
  "v 0.406276 1.000000 -1.000000",
  "v 1.000000 -1.000000 -1.000000",
  "v 0.398053 -1.000000 -1.000000",
  "v 0.406276 1.000000 1.000000",
  "v 0.398053 -1.000000 1.000000",
  "v 1.000000 -1.000000 1.000000",
  "v 1.000000 0.414499 -1.000000",
  "v 1.000000 0.414499 1.000000",
  "v -1.600713 0.812970 -1.150128",
  "v -1.600713 0.812970 -0.012368",
  "v -1.600713 -0.324790 -0.012368",
  "v -1.600713 -0.324790 -1.150128",
  "f 21 8 7",
  "f 28 18 17",
  "f 1 24 20",
  "f 25 24 20",
  "f 11 8 12",
  "f 12 9 13",
  "f 14 7 11",
  "f 13 10 14",
  "f 6 11 12",
  "f 5 12 13",
  "f 4 14 11",
  "f 3 13 14",
  "f 17 15 16",
  "f 29 17 16",
  "f 30 18 27",
  "f 29 15 30",
  "f 10 21 7",
  "f 23 9 8",
  "f 10 22 19",
  "f 26 19 22",
  "f 25 21 19",
  "f 21 24 23",
  "f 23 26 22",
  "f 4 29 30",
  "f 3 30 27",
  "f 5 29 6",
  "f 3 28 5",
  "f 21 23 8",
  "f 28 27 18",
  "f 1 2 24",
  "f 25 26 24",
  "f 11 7 8",
  "f 12 8 9",
  "f 14 10 7",
  "f 13 9 10",
  "f 6 4 11",
  "f 5 6 12",
  "f 4 3 14",
  "f 3 5 13",
  "f 17 18 15",
  "f 29 28 17",
  "f 30 15 18",
  "f 29 16 15",
  "f 10 19 21",
  "f 23 22 9",
  "f 10 9 22",
  "f 26 25 19",
  "f 25 20 21",
  "f 21 20 24",
  "f 23 24 26",
  "f 4 6 29",
  "f 3 4 30",
  "f 5 28 29",
  "f 3 27 28",
];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const AR = canvas.width / canvas.height;

// From bottom left to top right
// X: -1 to 1
// Y: -1 to 1

let cube = {
  points: [
    { x: -0.5, y: -0.5, z: 0.5 },
    { x: -0.5, y: 0.5, z: 0.5 },
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: 0.5, y: -0.5, z: 0.5 },
    { x: -0.5, y: -0.5, z: -0.5 },
    { x: -0.5, y: 0.5, z: -0.5 },
    { x: 0.5, y: 0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: -0.5 },
  ],
  triangle_indices: [
    // Front Face
    [0, 1, 2],
    [0, 2, 3],

    // Right Face
    [3, 2, 6],
    [3, 6, 7],

    // Back Face
    [7, 6, 5],
    [7, 5, 4],

    // Left Face
    [4, 5, 1],
    [4, 1, 0],

    // Top Face
    [1, 5, 6],
    [1, 6, 2],

    // Bottom Face
    [4, 0, 3],
    [4, 3, 7],
  ],
};

function loadObj(obj) {
  mesh = {
    points: [],
    triangle_indices: [],
  };
  for (let i = 0; i < object.length; i++) {
    const line = object[i];
    if (line.charAt(0) == "v") {
      const v = line.split(" ");
      mesh.points.push({
        x: parseFloat(v[1]),
        y: parseFloat(v[2]),
        z: parseFloat(v[3]),
      });
    } else if (line.charAt(0) == "f") {
      const f = line.split(" ");
      mesh.triangle_indices.push([
        parseInt(f[1]) - 1,
        parseInt(f[2]) - 1,
        parseInt(f[3]) - 1,
      ]);
    }
  }
  return mesh;
}

objectMesh = loadObj();

function ndcToView(v) {
  return {
    x: (v.x + 1) * 0.5 * canvas.width,
    y: (v.y + 1) * 0.5 * canvas.height,
    z: v.z,
  };
}

function subtract(v1, v2) {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
    z: v1.z - v2.z,
  };
}

function mag(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function calcNormal(v1, v2, v3) {
  const l1 = subtract(v2, v1);
  const l2 = subtract(v3, v1);
  let norm = cross(l2, l1);
  const m = mag(norm);
  norm.x = norm.x / m;
  norm.y = norm.y / m;
  norm.z = norm.z / m;
  return norm;
}

function negate(v) {
  return {
    x: -v.x,
    y: -v.y,
    z: -v.z,
  };
}

function drawTri(mesh, i, p, t, r) {
  const points = mesh.triangle_indices[i];
  let v1 = vecMatMultiply(vecMatMultiply(mesh.points[points[0]], r), t);
  let v2 = vecMatMultiply(vecMatMultiply(mesh.points[points[1]], r), t);
  let v3 = vecMatMultiply(vecMatMultiply(mesh.points[points[2]], r), t);

  // Calculate normals
  const norm = calcNormal(v1, v2, v3);
  const d = dot(norm, v1);
  if (d > 0) {
    v1 = ndcToView(vecMatMultiply(v1, p));
    v2 = ndcToView(vecMatMultiply(v2, p));
    v3 = ndcToView(vecMatMultiply(v3, p));

    // Lighting
    const dirLight = { x: 0, y: 0, z: 1 };
    const intensity = dot(dirLight, norm);

    ctx.fillStyle = `rgb(${intensity * 255}, ${intensity * 255}, ${
      intensity * 255
    })`;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.stroke();
    ctx.fill();
  }
}

function cross(v1, v2) {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };
}

function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function matMatMultiply(m1, m2) {
  return [
    [
      m1[0][0] * m2[0][0] +
        m1[0][1] * m2[1][0] +
        m1[0][2] * m2[2][0] +
        m1[0][3] * m2[3][0],
      m1[0][0] * m2[0][1] +
        m1[0][1] * m2[1][1] +
        m1[0][2] * m2[2][1] +
        m1[0][3] * m2[3][1],
      m1[0][0] * m2[0][2] +
        m1[0][1] * m2[1][2] +
        m1[0][2] * m2[2][2] +
        m1[0][3] * m2[3][2],
      m1[0][0] * m2[0][3] +
        m1[0][1] * m2[1][3] +
        m1[0][2] * m2[2][3] +
        m1[0][3] * m2[3][3],
    ],
    [
      m1[1][0] * m2[0][0] +
        m1[1][1] * m2[1][0] +
        m1[1][2] * m2[2][0] +
        m1[1][3] * m2[3][0],
      m1[1][0] * m2[0][1] +
        m1[1][1] * m2[1][1] +
        m1[1][2] * m2[2][1] +
        m1[1][3] * m2[3][1],
      m1[1][0] * m2[0][2] +
        m1[1][1] * m2[1][2] +
        m1[1][2] * m2[2][2] +
        m1[1][3] * m2[3][2],
      m1[1][0] * m2[0][3] +
        m1[1][1] * m2[1][3] +
        m1[1][2] * m2[2][3] +
        m1[1][3] * m2[3][3],
    ],
    [
      m1[2][0] * m2[0][0] +
        m1[2][1] * m2[1][0] +
        m1[2][2] * m2[2][0] +
        m1[2][3] * m2[3][0],
      m1[2][0] * m2[0][1] +
        m1[2][1] * m2[1][1] +
        m1[2][2] * m2[2][1] +
        m1[2][3] * m2[3][1],
      m1[2][0] * m2[0][2] +
        m1[2][1] * m2[1][2] +
        m1[2][2] * m2[2][2] +
        m1[2][3] * m2[3][2],
      m1[2][0] * m2[0][3] +
        m1[2][1] * m2[1][3] +
        m1[2][2] * m2[2][3] +
        m1[2][3] * m2[3][3],
    ],
    [
      m1[3][0] * m2[0][0] +
        m1[3][1] * m2[1][0] +
        m1[3][2] * m2[2][0] +
        m1[3][3] * m2[3][0],
      m1[3][0] * m2[0][1] +
        m1[3][1] * m2[1][1] +
        m1[3][2] * m2[2][1] +
        m1[3][3] * m2[3][1],
      m1[3][0] * m2[0][2] +
        m1[3][1] * m2[1][2] +
        m1[3][2] * m2[2][2] +
        m1[3][3] * m2[3][2],
      m1[3][0] * m2[0][3] +
        m1[3][1] * m2[1][3] +
        m1[3][2] * m2[2][3] +
        m1[3][3] * m2[3][3],
    ],
  ];
}

function vecMatMultiply(v, m) {
  const x = m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3];
  const y = m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3];
  const z = m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3];
  const w = m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3];

  if (w != 0) {
    return {
      x: x / w,
      y: y / w,
      z: z / w,
    };
  } else {
    return {
      x: x,
      y: y,
      z: z,
    };
  }
}

const FOV_RAD = Math.PI * 0.5;
const S = 1 / Math.tan(FOV_RAD * 0.5);
const f = 100;
const n = 0.1;
ppMat = [
  [(S * 1) / AR, 0, 0, 0],
  [0, S, 0, 0],
  [0, 0, f / (f - n), (-f * n) / (f - n)],
  [0, 0, 1, 0],
];
let a = 0;
let xPos = 0;
let zPos = 5;
let yPos = 0;

let keys = {};

window.addEventListener("keydown", function (event) {
  if (event.key == "a") {
    keys.a = true;
  } else if (event.key == "d") {
    keys.d = true;
  }
  if (event.key == "w") {
    keys.w = true;
  } else if (event.key == "s") {
    keys.s = true;
  }
  if (event.key == " ") {
    keys.space = true;
  } else if (event.key == "Shift") {
    keys.shift = true;
  }
});

window.addEventListener("keyup", function (event) {
  keys = {};
  if (event.key == "a") {
    keys.a = false;
  } else if (event.key == "d") {
    keys.d = false;
  }
  if (event.key == "w") {
    keys.w = false;
  } else if (event.key == "s") {
    keys.s = false;
  }
  if (event.key == " ") {
    keys.space = false;
  } else if (event.key == "Shift") {
    keys.shift = false;
  }
});

function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  const speed = 0.01;
  if (keys.a) {
    xPos += speed;
  } else if (keys.d) {
    xPos -= speed;
  }
  if (keys.w) {
    zPos -= speed;
  } else if (keys.s) {
    zPos += speed;
  }
  if (keys.space) {
    yPos += speed;
  } else if (keys.shift) {
    yPos -= speed;
  }

  yrMat = [
    [Math.cos(a), 0, -Math.sin(a), 0],
    [0, 1, 0, 0],
    [Math.sin(a), 0, Math.cos(a), 0],
    [0, 0, 0, 0],
  ];
  xrMat = [
    [1, 0, 0, 0],
    [0, Math.cos(a * 0.5), -Math.sin(a * 0.5), 0],
    [0, Math.sin(a * 0.5), Math.cos(a * 0.5), 0],
    [0, 0, 0, 0],
  ];
  let scale = 1;
  tMat = [
    [scale, 0, 0, xPos],
    [0, scale, 0, yPos],
    [0, 0, scale, zPos],
    [0, 0, 0, 0],
  ];
  objectMesh.triangle_indices.sort((a, b) => {
    const z1 =
      (objectMesh.points[a[0]].z +
        objectMesh.points[a[1]].z +
        objectMesh.points[a[2]].z) /
      3;
    const z2 =
      (objectMesh.points[b[0]].z +
        objectMesh.points[b[1]].z +
        objectMesh.points[b[2]].z) /
      3;
    return z2 > z1 ? 1 : -1;
  });
  for (let i = 0; i < objectMesh.triangle_indices.length; i++) {
    drawTri(objectMesh, i, ppMat, tMat, matMatMultiply(yrMat, xrMat));
  }
  a += 0.005;
  if (a > Math.PI * 4) {
    a = 0;
  }
  window.requestAnimationFrame(animate);
}

animate();
