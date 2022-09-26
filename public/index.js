import { Scene } from "./Scene.js";
let fps = 60;
let lastLoop = Date.now();
let interval = 1000 / fps;
let delta;
function run() {
    window.requestAnimationFrame(run);
    const thisLoop = Date.now();
    delta = (thisLoop - lastLoop);
    if (delta > interval) {
        lastLoop = thisLoop - (delta % interval);
        scene.update();
        scene.draw();
    }
}
const scene = Scene.getScene();
window.addEventListener("keydown", (e) => {
    scene.onKeyDown(e);
});
document.addEventListener('pointerlockchange', () => {
    window.addEventListener("mousemove", (e) => {
        scene.onMouseMove(e);
    });
});
setTimeout(() => {
    alert("Click on the screen to Play!");
}, 100);
run();
