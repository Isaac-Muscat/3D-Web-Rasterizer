import { Scene } from "./Scene.js";
const scene = Scene.getScene();
function run() {
    scene.update();
    scene.draw();
    window.requestAnimationFrame(run);
}
run();
