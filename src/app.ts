/******************************************************************************/
/*!
\file   apss.ts
\author Quah Joon Hui Conant
\par    SIT Email: 2002655@sit.singaporetech.edu.sg 
\par    course: CSD3120
\par    IPA
\brief
    This is the implementation of my web app to conduct a Chemistry Lesson
*/
/******************************************************************************/

import { 
    Engine,
    MeshBuilder,
    Scene,
    StandardMaterial,
    CubeTexture,
    Texture,
    Color3,
    ArcRotateCamera,
    Vector3,
    UniversalCamera,
    HemisphericLight,
    PointLight,
    VideoDome,
    SceneLoader,
    Animation,
    AbstractMesh,
    ParticleSystem,
    Color4,
    Sound,
    PointerDragBehavior,
    ActionManager,
    Observable,
    Observer,
    Tools,
    WebXRAbstractFeature,
    WebXRFeaturesManager,
    WebXRDefaultExperience,
    Mesh,
    WebXRFeatureName,
    WebXRMotionControllerTeleportation,
    TransformNode,
    MultiPointerScaleBehavior,
    SixDofDragBehavior,
    GizmoManager,
    ExecuteCodeAction,
    Axis,
    Space,
} from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from 'babylonjs-gui'
import 'babylonjs-loaders';
import { HelloSphere, TextPlane, Sphere, MyModel, MoleculeType, MyTextPlane} from './components/meshes';
//import * as BABYLON from 'babylonjs';

/*!**************************************************************************
    \brief
        This is the App Class
*/
/**************************************************************************/   
export class App {
    private engine: Engine;
    private canvas: HTMLCanvasElement;
    private sound: Sound;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
        console.log('app is running');
    }

    /*!**************************************************************************
        \brief
            This function creates and loads up a chemistry lesson scene

        \param canvasID
            ID of the canvas

        \param authoringData
            Data for XRauthor usage
    */
    /**************************************************************************/    
    async createXRScene(
        canvasID: string, 
        authoringData: { [dataType: string]: { [key: string]: any } }
    ) {
        const scene = new Scene(this.engine);
        scene.createDefaultCameraOrLight(false, true, true);
        //this.createCamera(scene);
        //this.createLights(scene);
        scene.actionManager = new ActionManager(scene);

        // create a simple Sphere to appear on the scene
        // const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1.3}, scene)
        // sphere.position.y = -0.5;
        // sphere.position.z = 5;

        //this.loadModel(scene);
        const floor = this.loadClassroomModel(scene, 'basic_classroom.glb', new Vector3(0, -1.3, 1), 1);

        const myModels: MyModel[] = [];
        const H2Model = new MyModel (scene, 'H2.glb', MoleculeType.H2, new Vector3(1.7, -0.6, -1), 0.1);
        myModels.push(H2Model);
        const H2Model2 = new MyModel (scene, 'H2.glb', MoleculeType.H2, new Vector3(1.7, -0.6, -0.85), 0.1);
        myModels.push(H2Model2);
        
        const O2Model = new MyModel (scene, 'O2.glb', MoleculeType.O2, new Vector3(1.7,-0.6,-1.7), 0.08);
        myModels.push(O2Model);

        const zone = MeshBuilder.CreateBox("zone", { width: 0.3, height: 0.3, depth: 0.3 }, scene);
        // position the box in the scene
        zone.position = new Vector3(1.6, -0.55, -1.95);
        const zoneMaterial = new StandardMaterial("translucentBoxMaterial", scene);
        zoneMaterial.alpha = 0.5;
        zone.material = zoneMaterial;
        const zoneMaximum = new Vector3(zone.position.x + 0.5 * 0.3, zone.position.y + 0.5 * 0.3, zone.position.z + 0.5 * 0.3);
        const zoneMinimum = new Vector3(zone.position.x - 0.5 * 0.3, zone.position.y - 0.5 * 0.3, zone.position.z - 0.5 * 0.3);


        //Create a button
        const HydrogenButton = MeshBuilder.CreatePlane("Button", {width: 0.6, height: 0.3});
        HydrogenButton.position = new Vector3(1.1, -0.6, -1);
        HydrogenButton.rotation = new Vector3(Math.PI/2, Math.PI / 2, 0);
        HydrogenButton.metadata = "Button";

        const HydrogenButtonTexture = AdvancedDynamicTexture.CreateForMesh(HydrogenButton, 200, 20, false);
        HydrogenButtonTexture.background = 'white';

        const HydrogenButtonText = new TextBlock("Button", "Spawn hydrogen molecules");
        HydrogenButtonText.color = 'grey'; 
        HydrogenButtonText.fontSize = 12;
        HydrogenButtonTexture.addControl(HydrogenButtonText);
        //Show something when button is pressed
        HydrogenButtonText.onPointerClickObservable.add(eventData => {
            const newH2Model = new MyModel (scene, 'H2.glb', MoleculeType.H2, new Vector3(1.2, -0.55, -1), 0.1);
            myModels.push(newH2Model);
        });

        const OxygenButton = MeshBuilder.CreatePlane("Button", {width: 0.6, height: 0.3});
        OxygenButton.position = new Vector3(1.1, -0.6, -1.7);
        OxygenButton.rotation = new Vector3(Math.PI/2, Math.PI / 2, 0);
        OxygenButton.metadata = "Button";

        const OxygenButtonTexture = AdvancedDynamicTexture.CreateForMesh(OxygenButton, 200, 20, false);
        OxygenButtonTexture.background = 'red';

        const OxygenButtonText = new TextBlock("Button", "Spawn oxygen molecules");
        OxygenButtonText.color = 'white'; 
        OxygenButtonText.fontSize = 12;
        OxygenButtonTexture.addControl(OxygenButtonText);
        //Show something when button is pressed
        OxygenButtonText.onPointerClickObservable.add(eventData => { 
            const newO2Model = new MyModel (scene, 'O2.glb', MoleculeType.O2, new Vector3(1.2, -0.55, -1.7), 0.1);
            myModels.push(newO2Model);
        });

        const ReactionButton = MeshBuilder.CreatePlane("Button", {width: 0.5, height: 0.2});
        ReactionButton.position = new Vector3(1.7, -0.2, -1.7);
        ReactionButton.rotation = new Vector3(0, Math.PI / 2, 0);
        ReactionButton.metadata = "Button";

        const ReactionButtonTexture = AdvancedDynamicTexture.CreateForMesh(ReactionButton, 300, 100, false);
        ReactionButtonTexture.background = 'black';

        const ReactionButtonText = new TextBlock("Button", "Make Reaction!");
        ReactionButtonText.color = 'white'; 
        ReactionButtonText.fontSize = 20;
        ReactionButtonTexture.addControl(ReactionButtonText);
        //Show something when button is pressed
        ReactionButtonText.onPointerClickObservable.add(eventData => {
            //scene.executeWhenReady(() => {
            const H2Models = myModels.filter(model => model.moleculeType === MoleculeType.H2);
            const O2Models = myModels.filter(model => model.moleculeType === MoleculeType.O2);
            const h2ModelsInBox: MyModel[] = [];
            const o2ModelsInBox: MyModel[] = [];

            for (const h2Model of H2Models) {
                const position = h2Model.mesh.position;
                if (position.x < zoneMaximum.x && position.y < zoneMaximum.y && position.z < zoneMaximum.z &&
                    position.x > zoneMinimum.x && position.y > zoneMinimum.y && position.z > zoneMinimum.z) {
                    h2ModelsInBox.push(h2Model);
                    console.log(h2Model.mesh.name);
                }
            }

            for (const o2Model of O2Models) {
                const position = o2Model.mesh.position;
                if (position.x < zoneMaximum.x && position.y < zoneMaximum.y && position.z < zoneMaximum.z &&
                    position.x > zoneMinimum.x && position.y > zoneMinimum.y && position.z > zoneMinimum.z) {
                    o2ModelsInBox.push(o2Model);
                    console.log(o2Model.mesh.name);
                }
            }

            if (h2ModelsInBox.length === 2 && o2ModelsInBox.length === 1) {
                for (const h2Model of h2ModelsInBox) {
                    h2Model.dispose();
                }

                for (const o2Model of o2ModelsInBox) {
                    o2Model.dispose();
                }

                // H2Model.dispose();
                // H2Model2.dispose();
                // O2Model.dispose();
                const H2OModel = new MyModel(scene, 'H2O.glb', MoleculeType.H2O, new Vector3(1.6, -0.55, -1.85), 0.1);
                const H2OModel2 = new MyModel(scene, 'H2O.glb', MoleculeType.H2O, new Vector3(1.6, -0.55, -1.95), 0.1);

            }
            //});
        });
        
        // window.addEventListener('keydown', (event) => {
        //     if (event.key === 'c') {
        //         for (const Model of myModels) {
        //             if (Model.isPicked) {
        //                 if (Model.moleculeType == MoleculeType.H2) {
        //                     const newModel = new MyModel(scene, 'H2.glb', MoleculeType.H2, Model.mesh.position, 0.1);
        //                     newModel.initActions();
        //                     myModels.push(newModel);
        //                 }
                        
        //                 else if (Model.moleculeType == MoleculeType.O2) {
        //                     const newModel = new MyModel(scene, 'O2.glb', MoleculeType.O2, Model.mesh.position, 0.1);
        //                     myModels.push(newModel);
        //                 }

        //                 else if (Model.moleculeType == MoleculeType.H2O) {
        //                     const newModel = new MyModel(scene, 'H2O.glb', MoleculeType.H2O, Model.mesh.position, 0.1);
        //                     myModels.push(newModel);
        //                 }
        //             }
        //         }
                
        //     }
        // });

        const H2Example = new TextPlane('H2', 0.2, 0.2, 2.5, 0.8, 1, "H2", "white", "grey", 25, scene);
        const H2Molecule = new MyModel (scene, 'H2.glb', MoleculeType.H2, new Vector3(2.5, 0.8, 0.8), 0.1);
        const O2Example = new TextPlane('O2', 0.2, 0.2, 2.5, 0.55, 1, "O2", "red", "pink", 25, scene);
        const O2Molecule = new MyModel (scene, 'O2.glb', MoleculeType.H2, new Vector3(2.5, 0.55, 0.8), 0.1);
        const H2OExample = new TextPlane('H2O', 0.2, 0.2, 2.5, 0.3, 1, "H2O", "white", "red", 25, scene);
        const H2OMolecule = new MyModel (scene, 'H2O.glb', MoleculeType.H2, new Vector3(2.4, 0.3, 0.75), 0.1);
        const chemicalReaction = new TextPlane('chemical reactions', 0.7, 0.2, 2.5, 0.8, -0.2, "2 H2 + O2 = 2 H2O", "black", "white", 25, scene);
        const instructions = new TextPlane('instructions', 1.2, 0.6, 2.5, 0.2, -0.2, 
        "Click on the molecules to drag them around\nTo rotate them by their axis,\nclick on the molecule and press x, y or z \nwith respect to the axis you wish to rotate by\nCombine the molecules to form a chemical reaction", "black", "white", 25, scene);
        
       

        // create a collider for the zone
        // const zoneCollider = new BABYLON.BoxCollider();
        // zoneCollider.size = zone.scaling;
        // zoneCollider.isTrigger = true;

        // // attach the collider to the zone
        // zone.addComponent(zoneCollider);

        // // add a function to be called when the collider is triggered
        // zoneCollider.onTriggerEnterObservable.add((collider) => {
        //     // check if the collider that triggered the event is the player's collider
        //     if (collider.name === "playerCollider") {
        //         // do something when the player enters the zone
        //     }
        // });

        // ground
        const groundMaterial = new StandardMaterial("ground material", scene);
        groundMaterial.backFaceCulling = true;
        // groundMaterial.diffuseTexture = new Texture('assets/textures/grass.png', scene);
        groundMaterial.alpha = 0;
        const ground = MeshBuilder.CreateGround("ground", {width: 8, height: 9}, scene);
        ground.material = groundMaterial;
        ground.position.set(-1, -1.2, 1);
         

        const pointerDragBehavior = new PointerDragBehavior({
            dragPlaneNormal: Vector3.Up(),
        });
        pointerDragBehavior.onDragStartObservable.add(evtData => {
            console.log("drag start: pointer id - " + evtData.pointerId);
            console.log(evtData);
        });
        const helloSphereDragBehavior = new PointerDragBehavior ({
            dragPlaneNormal: Vector3.Backward(),
        });

        // use observables
        // my observable
        

        const h2Nh2distanceChangeObservable = new Observable<number>();
        const o2Nh2distanceChangeObservable = new Observable<number>();
        scene.executeWhenReady(() => {

            // let prevO2nH2Dist: number = null;
            // let currentO2nH2Dist: number = null;
            // let prevH2nH2Dist: number = null;
            // let currentH2nH2Dist: number = null;
            // let hydrogenNoxygenCloseEnough: Boolean = false;
            // let hydroNhydroCloseEnough: Boolean = false;

           
            // scene.onBeforeRenderingGroupObservable.add(() => {
            //     for (const H2Model of H2Models) {
            //         for (const O2Model of O2Models) {
            //             currentO2nH2Dist = Vector3.Distance(
            //                 H2Model.mesh.position, 
            //                 O2Model.mesh.position
            //             );
            //             if (currentO2nH2Dist !== prevO2nH2Dist) {
            //                 //console.log("distance updated");
            //                 prevO2nH2Dist = currentO2nH2Dist;
            //                 o2Nh2distanceChangeObservable.notifyObservers(currentO2nH2Dist);
            //             }
            //         }
            //     }
                

            //     currentH2nH2Dist = Vector3.Distance(
            //         H2Model.mesh.position,
            //         H2Model2.mesh.position
            //     );
            //     if (currentH2nH2Dist !== prevH2nH2Dist) {
            //         //console.log("distance updated");
            //         prevH2nH2Dist = currentH2nH2Dist;
            //         h2Nh2distanceChangeObservable.notifyObservers(currentH2nH2Dist);
            //     }

                
            // });
    
            // H2Model.onDistanceChangeObservable = o2Nh2distanceChangeObservable;
            // H2Model.onDistanceChangeObservable.add((distance) => {
            //     hydrogenNoxygenCloseEnough = distance <= 0.05;
            //     if (hydrogenNoxygenCloseEnough && hydroNhydroCloseEnough) {
            //         console.log("h2 o2 dist is close");
            //         // H2Model.dispose();
            //         // H2Model2.dispose();
            //         // O2Model.dispose();
            //         // const H2OModel = new MyModel(scene, 'H2O.glb', MoleculeType.H2O, new Vector3(1.1, -0.4, -1), 0.1);
            //         // const H2OModel2 = new MyModel(scene, 'H2O.glb', MoleculeType.H2O, new Vector3(1.1, -0.4, -1.15), 0.1);
            //     }
            // });
            // H2Model.onDistanceChangeObservable = h2Nh2distanceChangeObservable;
            // H2Model.onDistanceChangeObservable.add((distance) => {
            //     hydroNhydroCloseEnough = distance <= 0.05;
            //     // if (hydrogenNoxygenCloseEnough && hydroNhydroCloseEnough ) {
            //     //     console.log("both dist is close");
            //     //     // H2Model.dispose();
            //     //     // H2Model2.dispose();
            //     //     // O2Model.dispose();
            //     //     const H2OModel = new MyModel(scene, 'H2O.glb', MoleculeType.H2O, new Vector3(1.1, -0.4, -1), 0.1);
            //     //     const H2OModel2 = new MyModel(scene, 'H2O.glb', MoleculeType.H2O, new Vector3(1.1, -0.4, -1.15), 0.1);                  
            //     // }
            // });
            
        });

        this.addInspectorKeyboardShortcut(scene);

        // XR session
        const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: 'immersive-vr'
                // sessionMode: 'immersive-ar'
            },
            optionalFeatures: true,
            pointerSelectionOptions: {
                enablePointerSelectionOnAllControllers: true
            },
        });
        // only for debugging
        (window as any).xr = xr;
        
        const featureManager = xr.baseExperience.featuresManager;
        console.log(WebXRFeaturesManager.GetAvailableFeatures());

        // locomotion
        const movement = MovementMode.Teleportation;
        this.initLocomotion(movement, xr, featureManager, ground, scene);

        // hand tracking
        try {
            featureManager.enableFeature(WebXRFeatureName.HAND_TRACKING, "latest", {
                xrInput: xr.input,
                jointMeshes: {
                    disableDefaultHandMesh: false,
                }
            });
        } catch (error) {
            console.log(error);
        }

        // hand/controller drag
        let mesh: AbstractMesh;
        xr.input.onControllerAddedObservable.add((controller => {
            controller.onMotionControllerInitObservable.add((motionController => {
                // const ids = motionController.getComponentIds();
                // const trigger = motionController.getComponent(ids[0]);
                const trigger = motionController.getComponentOfType("trigger");
                trigger.onButtonStateChangedObservable.add(() => {
                    if (trigger.changes.pressed) {
                        if (trigger.pressed) {
                            if (
                                (mesh = xr.pointerSelection.getMeshUnderPointer(
                                    controller.uniqueId
                                ))
                            ) {
                                console.log("mesh under controller pointer: " + mesh.name);
                                if (mesh.name !== "ground") {
                                    const distance = Vector3.Distance(
                                        motionController.rootMesh.getAbsolutePosition(), mesh.getAbsolutePosition()
                                    );
                                    console.log("distance: " + distance);
                                    if (distance < 1) {
                                        mesh.setParent(motionController.rootMesh);
                                        console.log("grab mesh: " + mesh.name);
                                    }
                                }
                            } else {
                                console.log("no mesh under pointer");
                            }
                        } else {
                            if (mesh && mesh.parent) {
                                mesh.setParent(null);
                                console.log("release mesh: " + mesh.name);
                            }
                        }
                    }
                });
            }));
        }));

        //enabled features
        console.log(featureManager.getEnabledFeatures());

        return scene;
    }

    /*!**************************************************************************
    \brief
        This is a function creates a camera for the scene
    */
    /**************************************************************************/   
    createCamera(scene: Scene) {
        //const camera = new ArcRotateCamera('arcCamera', -Math.PI, Math.PI/2, 5, Vector3.Zero(), scene);
        const camera = new UniversalCamera('uniCamera', new Vector3(0, 0, -5), scene);
        camera.attachControl(this.canvas, true);
    }

    /*!**************************************************************************
        \brief
            This is a function creates lights for the scene
    */
    /**************************************************************************/   
    createLights(scene: Scene) {
        const hemiLight = new HemisphericLight('hemLight', new Vector3(-1, 1, 0), scene);
        hemiLight.intensity = 0.3;
        hemiLight.diffuse = new Color3(1, 1, 1);

        const pointLight = new PointLight('pointLight', new Vector3(0, 1.5, 2), scene);
        pointLight.intensity = 1;
        pointLight.diffuse = new Color3(1, 0, 0);
    }

    /*!**************************************************************************
        \brief
            This is my function that loads the classroom model into the scene and
            acts as the entire environment
    */
    /**************************************************************************/
    loadClassroomModel(scene: Scene, fileName: string, position: Vector3, scale: number) : AbstractMesh {
        let loadedMesh: AbstractMesh;
        SceneLoader.ImportMeshAsync('', 'assets/models/', fileName, scene).then(result => {
            const root = result.meshes[0];
            root.id = fileName;
            root.name = fileName;
            root.position = position;
            //root.rotation = new Vector3(0, 0, Math.PI);
            root.scaling.setAll(scale);
            loadedMesh = root;
        });
        return loadedMesh;
    }

    /*!**************************************************************************
        \brief
            This is a function creates the animation for a model
            It spins the model around continuously
    */
    /**************************************************************************/
    createAnimation(scene: Scene, model: AbstractMesh) {
        const animation = new Animation(
            'rotationAnima','rotation', 30,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );
        const keyframes = [
            {frame: 0, value: new Vector3(0, 0, 0)},
            {frame: 30, value: new Vector3(0, 2 * Math.PI, 0)}
        ]
        animation.setKeys(keyframes);

        model.animations = [];
        model.animations.push(animation);
        scene.beginAnimation(model, 0, 30, true);
    }

    /*!**************************************************************************
        \brief
            This is a function that creates particles for the environment

        \param scene
            It takes in the scene in which is will spawn the particles
    */
    /**************************************************************************/
    createParticles (scene: Scene) {
        const particleSystem = new ParticleSystem('particles', 5000, scene);
        particleSystem.particleTexture = new Texture('assets/textures/flare.png', scene);

        particleSystem.emitter = new Vector3(0, 0, 0);
        particleSystem.minEmitBox = new Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new Vector3(0, 0, 0);

        particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new Color4(0.3, 0.5, 1.0, 1.0);
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

        particleSystem.minSize = 0.01;
        particleSystem.maxSize = 0.05;

        particleSystem.minLifeTime = 0.3,
        particleSystem.maxLifeTime = 1.5;

        particleSystem.emitRate = 1500;

        particleSystem.direction1 = new Vector3(-1, 8, 1);
        particleSystem.direction2 = new Vector3(1, 8, -1);

        particleSystem.minEmitPower = 0.2;
        particleSystem.maxEmitPower = 0.8;
        particleSystem.updateSpeed = 0.01;

        particleSystem.gravity = new Vector3(0, -9.8, 0);
        particleSystem.start();
    }

    /*!**************************************************************************
        \brief
            This function adds sound

        \param scene
            It takes in the scene in which is will play a sound
    */
    /**************************************************************************/
    addSounds(scene: Scene) {
        const music = new Sound('music', 'assets/sounds/hello-xr.mp3', scene, null, {loop: true, autoplay: false});
        // const sound = new Sound('sound', 'assets/sounds/button.mp3', scene, () => sound.play(), {loop: true});
        this.sound = new Sound('sound', 'assets/sounds/button.mp3', scene, null);
    }

    /*!**************************************************************************
        \brief
            This function creates text

        \param scene
            It takes in the scene in which is spawn the text
    */
    /**************************************************************************/
    createText(scene: Scene) {
        const helloPlane = new TextPlane(
            "hello", 
            3, 
            1, 
            0,
            2,
            5,
            "Hello Xr",
            "white", 
            "purple",
            60,
            scene);
        helloPlane.textBlock.onPointerUpObservable.add(evtData => {
            alert('Hello Text at:\n x: ' + evtData.x + 'y: ' + evtData.y);
        });
        helloPlane.textBlock.onPointerDownObservable.add(() => {
            this.sound.play();
        })
    }

    /*!**************************************************************************
        \brief
            This function creates a skybox

        \param scene
            It takes in the scene in where the skybox will appear
    */
    /**************************************************************************/
    createSkybox(scene:Scene) {
        const skybox = MeshBuilder.CreateBox('skybox', {size: 1000}, scene);
        const skyboxMaterial = new StandardMaterial('skybox-mat');

        skyboxMaterial.backFaceCulling = false;

        skyboxMaterial.reflectionTexture = new CubeTexture('assets/textures/skybox', scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial
    }

    /*!**************************************************************************
        \brief
            This function creates a video skydome

        \param scene
            It takes in the scene in which it will play the video
    */
    /**************************************************************************/
    createVideoSkyDome (scene: Scene) {
        const dome = new VideoDome('videoDome', 'assets/videos/bridge-360.mp4', 
        {
            resolution: 32,
            size: 1000
        }, scene);
    }

    /*!**************************************************************************
        \brief
            This function brings up the debug layer

        \param scene
            It takes in the scene in which it will spawn the debug layer
    */
    /**************************************************************************/
    addInspectorKeyboardShortcut(scene: Scene) {
        //scene.debugLayer.show();
        window.addEventListener('keydown', e => {
            if (e.metaKey && e.ctrlKey && e.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
                
            }
        });
    }

    // dont teleport to floor
    /*!**************************************************************************
        \brief
            This function creates a way for user to move around in the Virtual Environment

        \param movement
            The mode of movement

        \param xr
            Default XR Experience
        
        \param featureManager
            Base experience feature manager
        
        \param ground
            Indicates what object is taken as the ground to walk on

        \param scene
            Indicates the scene to navigate

    */
    /**************************************************************************/
    initLocomotion(
        movement: MovementMode, 
        xr: WebXRDefaultExperience,
        featureManager: WebXRFeaturesManager, 
        ground: Mesh,
        scene: Scene
    ) {
        switch (movement) {
            case MovementMode.Teleportation:
                console.log("movement mode: teleportation");
                const teleportation = featureManager.enableFeature(
                    WebXRFeatureName.TELEPORTATION,
                    "stable",
                    {
                        xrInput: xr.input,
                        floorMeshes: [ground],
                        timeToTeloport: 2000,
                        useMainComponentOnly: true,
                        defaultTargetMeshOptions: {
                            teleportationFillColor: "#55FF99",
                            teleportationBorderColor: "blue",
                            torusArrowMaterial : ground.material,
                        },
                    },
                    true,
                    true
                ) as WebXRMotionControllerTeleportation
                teleportation.parabolicRayEnabled = true;
                teleportation.parabolicCheckRadius = 2;
                break;

            case MovementMode.Controller:
                console.log("movement mode: controller");
                featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
                featureManager.enableFeature(WebXRFeatureName.MOVEMENT, "latest", {
                    xrInput: xr.input,  
                });
                break;

            case MovementMode.Walk:
                console.log("movement mode: walk");
                featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
                const xrRoot = new TransformNode("xr root", scene);
                xr.baseExperience.camera.parent = xrRoot;
                featureManager.enableFeature(
                    WebXRFeatureName.WALKING_LOCOMOTION,
                    "latest",
                    {
                        locomotionTarget: xrRoot,
                    }
                );
                break;
        }      
    }
}

/*!**************************************************************************
    \brief
        This is a enum class for the different movement modes
*/
/**************************************************************************/
enum MovementMode {
    Teleportation,
    Controller,
    Walk,
}