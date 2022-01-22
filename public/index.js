import { Scene } from "./Scene.js";
function run() {
    scene.update();
    scene.draw();
    window.requestAnimationFrame(run);
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
