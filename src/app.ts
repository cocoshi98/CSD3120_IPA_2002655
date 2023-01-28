import { Engine, HtmlElementTexture, MeshBuilder, Scene} from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from 'babylonjs-gui'

/*************************************************
    \brief   This is the App class
*************************************************/
export class App {
    private engine: Engine;
    private canvas: HTMLCanvasElement;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
        console.log('app is running');
    }

    /*************************************************
        \brief   This functions creates a scene
    *************************************************/
    async createScene() {
        const scene = new Scene(this.engine);
        scene.createDefaultCameraOrLight();

        // create a Sphere to appear on the scene
        const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1.3}, scene)
        sphere.position.y = 1;
        sphere.position.z = 5;

        // create a plane to appear on the scene
        const helloPlane = MeshBuilder.CreatePlane('hello plane', {size: 15});
        helloPlane.position.y = 0
        helloPlane.position.z = 5;
        
        // create text to appear on the scene
        const helloTexture = AdvancedDynamicTexture.CreateForMesh(helloPlane);
        const helloText = new TextBlock('hello');
        helloText.text = 'Hello XR';
        helloText.color = 'purple';
        helloText.fontSize = 50;
        helloTexture.addControl(helloText);

        const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: 'immersive-vr'
                // sessionMode: 'immersive-ar'
            }
        });
        // only for debugging
        (window as any).xr = xr;
        
        return scene;
    }
}