// Import the necessary libraries
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
//import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import * as dat from 'https://cdn.skypack.dev/dat.gui';
import { FlyControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/FlyControls";


////////////////////////////// Create a scene Start //////////////////////////////

// Create a Three.js Scene
const scene = new THREE.Scene();
// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();
// Controls for FlyControls and Object to load
let controls, object;
// Name of the model to load
let objToRender = 'newroom';

////////////////////////////// Create a scene End //////////////////////////////

////////////////////////////// Renderer and Camera Start //////////////////////////////

const  renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas")});
renderer.antialias = true,
renderer.setClearColor(0xffffff);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFShadowMap; // Choose appropriate shadow map type
// Optionally, adjust the aspect ratio based on the window size
window.addEventListener('resize', function() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera1.aspect = width / height;
  camera1.updateProjectionMatrix();
});
// Initial camera
const camera1 = new THREE.PerspectiveCamera(70,  2, 1, 1000);
camera1.position.set(-6.9, 7.9, -13.5); // Set camera position
camera1.lookAt(50.9, -33.6, 56.8); // Look at the center of the scene (0, 0, 0)

////////////////////////////// Renderer and Camera End //////////////////////////////



////////////////////////////// FlyControls Start //////////////////////////////

// Initiate FlyControls with various params
controls = new FlyControls( camera1, renderer.domElement );
controls.movementSpeed = 100;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;
let cameraDirection = new THREE.Vector3();
let camPositionSpan, camLookAtSpan, camRotationSpan;
// Set the spans with the queried HTML DOM elements
  camPositionSpan = document.querySelector("#position");
  camLookAtSpan = document.querySelector("#lookingAt");
  camRotationSpan = document.querySelector("#rotation");

////////////////////////////// FlyControls End //////////////////////////////

////////////////////////////// Lights Start //////////////////////////////

// Add hemilight
const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 8);
scene.add(hemiLight);

// // Add pointlight
// const pointLight = new THREE.PointLight(0xffffff, 2);
// pointLight.position.set(0, 8, 0);
// pointLight.intensity = 6; // Set intensity to 4
// scene.add(pointLight);

// // Add spotlight
// const spotLight =  new THREE.SpotLight(0xffa95c,4);
// spotLight.position.set(0, 8, 0);
// spotLight.intensity = 6; // Set intensity to 4
// spotLight.castShadow = true;
// spotLight.shadow.bias = -0.0001;
// spotLight.shadow.mapSize.width = 1024*6;
// spotLight.shadow.mapSize.height = 1024*6;
// scene.add(spotLight);


////////////////////////////// Lights End //////////////////////////////

////////////////////////////// View Navigation Start //////////////////////////////

const predefinedViews = [
  { position: { x: -6.9, y: 7.9, z: -13.5 }, lookAt: { x: 50.9, y: -33.6, z: 56.8 } },
  { position: { x: -17.4, y: 8.5, z: -1.5 }, lookAt: { x: 40.4, y: -33, z: 68.8 } },
  { position: { x: -21, y: 9.4, z: 19.0 }, lookAt: { x: 36.8, y: -32.1, z: 89.3 } }
];

let currentViewIndex = 0; // Initialize current view index

// Add event listener to the button with class name "boton_out"
const backButton = document.querySelector('.button_back');
backButton.addEventListener('click', function() {
    // Go to the previous view if not at the first view
    if (currentViewIndex > 0) {
        currentViewIndex--;
        goToView(predefinedViews[currentViewIndex]);
    }
});

// Add event listener to the button with class name "boton_in"
const nextButton = document.querySelector('.button_next');
nextButton.addEventListener('click', function() {
    // Go to the next view if not at the last view
    if (currentViewIndex < predefinedViews.length - 1) {
        currentViewIndex++;
        goToView(predefinedViews[currentViewIndex]);
    }
});

// Function to go to a specific view
function goToView(view) {
    // Disable/enable buttons based on current view index
    backButton.disabled = currentViewIndex === 0;
    nextButton.disabled = currentViewIndex === predefinedViews.length - 1;

    tweenCameraPosition(camera1.position, view.position);
    tweenCameraPosition(camera1.lookAt, view.lookAt);
}

// Function to tween camera position
function tweenCameraPosition(position, targetPosition) {
    new TWEEN.Tween(position)
        .to(targetPosition, 1000) // Duration of the tween in milliseconds
        .easing(TWEEN.Easing.Quadratic.InOut) // Easing function
        .start();
}

////////////////////////////// View Navigation End //////////////////////////////

////////////////////////////// Loader Start //////////////////////////////
// Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    // If the file is loaded, add it to the scene
    object = gltf.scene;
   
    // Check if there are animations
    if (gltf.animations && gltf.animations.length > 0) {
      // Create a mixer for the animations
      const mixer = new THREE.AnimationMixer(object);

      // Play all animations
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

      // Add the mixer to a global scope so that it can be accessed within the animate function
      object.mixer = mixer;
    }

    scene.add(object);

    object.traverse((child) => {
      if (child.isMesh) {
          child.castShadow = true; // Enable shadow casting
          child.receiveShadow = true; // Enable shadow receiving
          if(child.material.map) child.material.map.anisotropy = 16;
      }
  });

////////////////////////////// Loader End //////////////////////////////

////////////////////////////// Light Control GUI Start //////////////////////////////

// // Create GUI
//     const gui = new dat.GUI();
// // Spotlight controls
// const spotlightControls = {
//   posX: spotLight.position.x,
//   posY: spotLight.position.y,
//   posZ: spotLight.position.z,
//   intensity: spotLight.intensity
// };

// const spotlightFolder = gui.addFolder('Spotlight');
// spotlightFolder.add(spotlightControls, 'posX', -10, 10).name('Position X').onChange(updateSpotlightPosition);
// spotlightFolder.add(spotlightControls, 'posY', -10, 10).name('Position Y').onChange(updateSpotlightPosition);
// spotlightFolder.add(spotlightControls, 'posZ', -10, 10).name('Position Z').onChange(updateSpotlightPosition);
// spotlightFolder.add(spotlightControls, 'intensity', 0, 10).name('Intensity').onChange(updateSpotlightIntensity);
// spotlightFolder.open(); // Open the folder by default

// // Function to update spotlight position based on GUI controls
// function updateSpotlightPosition() {
//   spotLight.position.set(spotlightControls.posX, spotlightControls.posY, spotlightControls.posZ);
// }

// // Function to update spotlight intensity based on GUI controls
// function updateSpotlightIntensity() {
//   spotLight.intensity = spotlightControls.intensity;
// }
// // Pointlight controls
// const pointlightControls = {
//   posX: pointLight.position.x,
//   posY: pointLight.position.y,
//   posZ: pointLight.position.z,
//   intensity: pointLight.intensity
// };

// const pointlightFolder = gui.addFolder('Pointlight');
// pointlightFolder.add(pointlightControls, 'posX', -10, 10).name('Position X').onChange(updatePointlightPosition);
// pointlightFolder.add(pointlightControls, 'posY', -10, 10).name('Position Y').onChange(updatePointlightPosition);
// pointlightFolder.add(pointlightControls, 'posZ', -10, 10).name('Position Z').onChange(updatePointlightPosition);
// pointlightFolder.add(pointlightControls, 'intensity', 0, 10).name('Intensity').onChange(updatePointlightIntensity);
// pointlightFolder.open(); // Open the folder by default

// // Function to update spotlight position based on GUI controls
// function updatePointlightPosition() {
//   pointLight.position.set(pointlightControls.posX, pointlightControls.posY, pointlightControls.posZ);
// }

// // Function to update spotlight intensity based on GUI controls
// function updatePointlightIntensity() {
//   pointLight.intensity = pointlightControls.intensity;
// }

// // Append button to the DOM
document.body.appendChild(displayValuesButton);
  },
);
////////////////////////////// Light Control GUI - End //////////////////////////////

function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width ||canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera1.aspect = width / height;
    camera1.updateProjectionMatrix();
  }
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  resizeCanvasToDisplaySize();
  TWEEN.update(); // Update the tween
  // 5. calculate and display the vector values on screen
  // this copies the camera's unit vector direction to cameraDirection
  camera1.getWorldDirection(cameraDirection)
  // scale the unit vector up to get a more intuitive value
  cameraDirection.set(cameraDirection.x * 100, cameraDirection.y * 100, cameraDirection.z * 100)
  // update the onscreen spans with the camera's position and lookAt vectors
  camPositionSpan.innerHTML = `Position: (${camera1.position.x.toFixed(1)}, ${camera1.position.y.toFixed(1)}, ${camera1.position.z.toFixed(1)})`
  camLookAtSpan.innerHTML = `LookAt: (${(camera1.position.x + cameraDirection.x).toFixed(1)}, ${(camera1.position.y + cameraDirection.y).toFixed(1)}, ${(camera1.position.z + cameraDirection.z).toFixed(1)})`
  camRotationSpan.innerHTML = `Rotation: (${(camera1.rotation.x + cameraDirection.x).toFixed(1)}, ${(camera1.rotation.y + cameraDirection.y).toFixed(1)}, ${(camera1.rotation.z + cameraDirection.z).toFixed(1)})`
  controls.update(0.01)

  // Update the animation mixer
  if (object && object.mixer) {
    object.mixer.update(0.016); // Use a fixed delta time or your own calculation
  }

  renderer.render(scene, camera1);
}
// Start the 3D rendering
requestAnimationFrame(animate);
animate();
updateButtonState();

