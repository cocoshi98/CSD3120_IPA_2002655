/******************************************************************************/
/*!
\file   model.ts
\author Quah Joon Hui Conant
\par    SIT Email: 2002655@sit.singaporetech.edu.sg 
\par    course: CSD3120
\par    IPA
\brief
    This is the implementation of a MyModel Class
*/
/******************************************************************************/

import { AbstractMesh, ActionManager, Axis, ExecuteCodeAction, Mesh, PointerDragBehavior, Scene, SceneLoader, Space, Vector3, Animation, Observable, MultiPointerScaleBehavior } from "babylonjs";

/*!**************************************************************************
    \brief
        This is MyModel class that extends an AbstractMesh. 
        It is used to load models and give it its behaviors.
*/
/**************************************************************************/    
export class MyModel extends AbstractMesh{
    scene: Scene;
    mesh: Mesh;
    moleculeType: MoleculeType
    isPicked = false;
    onDistanceChangeObservable: Observable<number>;
    onIntersectObservable: Observable<boolean>;
    onScaleObservable: Observable<Vector3>;

    constructor(scene: Scene, fileName: string, moleculeType: MoleculeType, position: Vector3, scale: number) {
        super("", scene);
        this.moleculeType = moleculeType;
        console.log(MoleculeType[this.moleculeType].toString() + " exists");
        // Create the mesh and add it as a child of this node
        SceneLoader.ImportMeshAsync('', 'assets/models/', fileName, scene).then(result => {
            const root = result.meshes[0];
            
            if (moleculeType === MoleculeType.H2) {
                root.id = 'H2';
                root.name = 'H2';
            }

            else if (moleculeType === MoleculeType.O2) {
                root.id = 'O2';
                root.name = 'O2';
            }
            root.position = position;
            //root.rotation = new Vector3(0, 0, Math.PI);
            root.scaling.setAll(scale);

            this.mesh = root as Mesh;
           
            //this.addChild(root);

            this.initActions();
        });
    }

    /*!**************************************************************************
        \brief
            This is function disposes the mesh
    */
    /**************************************************************************/  
    public dispose() {
        if (this.mesh) {
            this.mesh.dispose();
        }
        //this.scene.removeMesh(this);
    }

    /*!**************************************************************************
        \brief
            This is function initializes all the behaviors and and Event listeners
    /**************************************************************************/  
    initActions() {

        const dragBehavior = new PointerDragBehavior({ dragPlaneNormal: Vector3.Up() });
        this.mesh.addBehavior(dragBehavior);

        const multiPointerScaleBehavior = new MultiPointerScaleBehavior();
        this.mesh.addBehavior(multiPointerScaleBehavior);

        const actionManager = this.actionManager = new ActionManager(this.scene);
        actionManager.isRecursive = true;

        // Register an action that sets `isPicked` to true when the model is picked
        actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickDownTrigger,
                () => { this.isPicked = true; }
            )
        );

        // Register an action that sets `isPicked` to false when the model is no longer picked
        actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickUpTrigger,
                () => { this.isPicked = false; }
            )
        );

                
        window.addEventListener('keydown', (event) => {
            if (event.key === 'z'&& this.isPicked) {
                // Rotate the mesh along the X axis
                this.mesh.rotate(Axis.Z, Math.PI / 2, Space.WORLD);
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'x'&& this.isPicked) {
                // Rotate the mesh along the X axis
                this.mesh.rotate(Axis.X, Math.PI / 2, Space.WORLD);
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'y'&& this.isPicked) {
                // Rotate the mesh along the X axis
                this.mesh.rotate(Axis.Y, Math.PI / 2, Space.WORLD);
            }
        });

        // window.addEventListener('wheel', (event) => {
        //     if (this.isPicked) {
        //         const scaleChange = event.deltaY > 0 ? 0.1 : -0.1;
        //         const newScale = this.mesh.scaling.add(new Vector3(scaleChange, scaleChange, scaleChange));
        //         this.onScaleObservable.notifyObservers(newScale);
        //     }
        // });
    }
}

/*!**************************************************************************
    \brief
        This is function disposes the mesh
*/
/**************************************************************************/  
export enum MoleculeType {
    O2,
    H2,
    H2O,
}