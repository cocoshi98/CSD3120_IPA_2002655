import { AbstractMesh, ActionManager, Color3, ExecuteCodeAction, InterpolateValueAction, Mesh, MeshBuilder, Observable, PredicateCondition, Scene, SetValueAction, StandardMaterial, Vector3} from "babylonjs";

export interface MyMesh {
    scene: Scene;
    mesh: Mesh;
    onDistanceChangeObservable: Observable<number>;
    onIntersectObservable: Observable<boolean>;
}

export class Sphere extends AbstractMesh implements MyMesh{
    scene: Scene;
    mesh: Mesh;
    onDistanceChangeObservable: Observable<number>;
    onIntersectObservable: Observable<boolean>;

    constructor(name: string, options: { diameter: number }, scene: Scene) {
        super(name, scene);
        this.scene = scene;
        this.mesh = MeshBuilder.CreateSphere("hello sphere mesh", options, scene);
        this.mesh.material = new StandardMaterial("hello sphere mesh", scene);
        this.addChild(this.mesh);
        this.initActions();
    }

    sayHello(message?: string): void {
     console.log("message from hello sphere: " + message);   
    }

    private initActions() {
        const actionManager = this.actionManager = new ActionManager(this.scene);
        actionManager.isRecursive = true;

        // changes mesh to wireframe when collision occurs
        const otherMesh = this.scene.getMeshById("sphere")
        actionManager.registerAction(
            new SetValueAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: otherMesh,
                        usePreciseIntersection: true,
                    }
                },
                this.mesh.material,
                "wireframe",
                true
            )
        );

        // resets the Sphere
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnKeyUpTrigger,
                    parameter: "r",
                },
                () => {
                    this.scaling.setAll(1);
                    if (this.mesh.material){
                        this.mesh.material.wireframe = false;
                    }
                    console.log("r was pressed: reset " + this.name);
                }
            )
        );
    }
}