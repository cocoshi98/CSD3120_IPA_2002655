import { Mesh, MeshBuilder, Scene } from 'babylonjs';
import { AdvancedDynamicTexture, TextBlock } from 'babylonjs-gui';

export class TextPlane {
    public mesh: Mesh
    public textBlock: TextBlock;

    constructor (
        name: string, 
        width: number, 
        height: number, 
        x: number, 
        y: number, 
        z: number,
        text: string,
        backgroundColor: string,
        textColor: string,
        fontSize: number,
        scene: Scene
        ) {
        // create a plane to appear on the scene
        const textPlane = MeshBuilder.CreatePlane(name + 'text plane', {
            /*size: 1.5,*/ 
            width: width, 
            height: height, 
        });
        textPlane.position.set(x, y, z);
        textPlane.rotation.y = Math.PI/2;

        // create text to appear on the scene
        const planeTexture = AdvancedDynamicTexture.CreateForMesh(
            textPlane, 
            width*500, 
            height*500, 
            false
        );
        planeTexture.background = backgroundColor;
        const planeText = new TextBlock(text);
        planeText.text = text;
        planeText.color = textColor;
        planeText.fontSize = fontSize;
        planeTexture.addControl(planeText);

        this.textBlock = planeText;
        this.mesh = textPlane;
    }
}


