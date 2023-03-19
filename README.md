# CSD3120 Intro to VR - IPA
- Name: Quah Joon Hui Conant
- SIT ID: 2002655

---

# Running the WebXR webapp
## Required dependencies
- Open Command Prompt (cmd) or Powershell at where the `src` folder is at
- **Run** `npm install --save babylonjs babylonjs-gui babylonjs-loaders`
- **Run** `npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin typescript ts-loader`
- **Run** `npm install copy-webpack-plugin -D`

## Running the web app
- Open **Command Prompt (cmd)** or **Linux console** inside the project folder.
- **Run** `npm run serve` to start a local server and build the project.
- Open web browser and go to `localhost:3000`.

## Hardware requirements
- Mouse and keyboard
- 2 controllers (Left and Right) with **Trigger** button.
- Tested on **HTC Vive**.

## PC Controls
| **Task** | **Control** |
| :---: | :--- |
| Moving | Arrow keys, move mouse to turn around. |
| Pick up object | Click on the molecules and drag around. |
| Rotate object | Click on "x", "y", "z" keys to rotate along the respective axis. Object must be selected|

## XR Controls
| **Task** | **Control** |
| :---: | :--- |
| Pick up object | With the laser pointer pointing at an object, press `Trigger button` with that controller. |
| Release object | Release `Trigger button`. |
| Translation | With an object picked up, move the controller around. |
| Scaling | Using a second controller, pick up the object that is being picked up by the first controller. Then move the 2 controllers apart to scale up, or move them closer to scale down. |
| Teleporting | Hold `Trigger button` for 2s to teleport to that location. |

## How to use the webapp
- Move 2 hydrogen molecules and 1 oxygen molecule to teach one another and it will produce 2 water molecules
- Requires 2 Hydrogen molecules + 1 Oxygen molecule into the box to form 2 Water molecules.
- Press **Add Water/Oxygen** buttons to spawn more molecules.
- Press **Make Reaction** button to make the molecuels react.
- To press button, just click it (on PC) or press trigger button while the laser pointer is pointing at it (on VR).

---

# Files
| **File** | **Description** |
| :---: | :--- |
| index.ts | Entry point of the web program, creates a new application and run the scene update and render|
| app.ts | Contains the app class which creates and runs the XR scene |
| model.ts | My Model class to create models|
| mesh.ts | Mesh class to creates meshes |
| text-plane.ts | TextPlane class to create text planes |
| textPlaneImage.ts | TextPlanImage class to create images |

---

# XRAuthor - Not done for IPA-B
