import { Engine, Scene } from "babylonjs";
import {App} from './app'
// console.log('hello world');

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d');
// ctx.font = '50px Arial';
// ctx.fillText('Hello XR', 50, 50);

// initialises the engine
const engine = new Engine(canvas, true);

// initialises the app
const app = new App(engine, canvas);

// creates a scene in the app
const scenePromise = app.createXRScene('renderCanvas', {});
// engine.runRenderLoop(() => {
//     scene.render();
// })

// runs the render loop to render the scene in the app
scenePromise.then(scene => {
    engine.runRenderLoop(() => {
        scene.render();
    })
})

window.addEventListener('resize', () => {
    engine.resize();
})
