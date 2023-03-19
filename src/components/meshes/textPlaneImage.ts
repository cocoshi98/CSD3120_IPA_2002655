import { Mesh, MeshBuilder, Scene } from 'babylonjs';
import { AdvancedDynamicTexture, TextBlock, Image } from 'babylonjs-gui';

export class MyTextPlane {
    public mesh: Mesh
    public textBlock: TextBlock;

    constructor (
        name: string, 
        width: number, 
        height: number, 
        x: number, 
        y: number, 
        z: number,
        backgroundColor: string,
        imageUrl: string,
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

        const planeTexture = AdvancedDynamicTexture.CreateForMesh(
            textPlane, 
            width*500, 
            height*500, 
            false
        );
        planeTexture.background = backgroundColor;

        // create image to appear on the scene
        const planeImage = new Image('image', imageUrl);
        planeImage.width = width*500;
        planeImage.height = height*500;
        planeTexture.addControl(planeImage);

        this.mesh = textPlane;
    }
}