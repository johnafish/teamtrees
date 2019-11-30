//
// #TeamTrees Web Version
// John Fish, Nov 2019
//

/*
Changed made by snoh666:
  - new fetchTrees function without need of jQuery

*/

// README: generate an API key here: https://wrapapi.com/api/johnfish/teamtrees/treecount/0.0.1
// it will not update without such a key
const wrapAPIKey = "HOT0YjzjeiEM8RzAVS73P1W6424qOZVn";

// Various three.js global variables
let scene,
    camera,
    renderer,
    controls,
    group;

// Tracking tree count
let numTrees = 16000000;
let curTrees = 0;

// Leaf materials
const leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91E56E });
const leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xA2FF7A });
const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7D5A4F });
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

const radius = 35; // Planet radius

// Takes number, formats as currency... stolen from stackoverflow
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// Retrieve trees from wrapapi, update text + grow trees when appropriate
const setupTrees = (data) => {
  if (data.success) {
    numTrees = data.data['#totalTrees'];
  }
  document.getElementById('cash').innerText = `$${numTrees.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;  // Custom js (es6) funcion for formating into money
  const diff = Math.floor(numTrees / 10000) - curTrees;

  if(diff > 0) {
    curTrees += diff;
    growTrees(diff);
  }

}

const fetchTrees = async _ => {

  const response = await fetch(`https://wrapapi.com/use/snoh666/teamtrees/treecount/0.0.1?wrapAPIKey=${wrapAPIKey}`, {
    method: 'GET'
  });

  const value = await response.json();

  await console.log(value);

  await setupTrees(value);

  return Promise.resolve();
}

// Generate a planet at (0,0,0) with specified radius
function planet(r) {
  var groundMaterial = new THREE.MeshLambertMaterial({ color: 0x634b35});
  var planetGeometry = new THREE.SphereGeometry(r, 100, 100);
  var planet = new THREE.Mesh(planetGeometry, groundMaterial);
  planet.position.set(0,0,0);
  scene.add(planet)
}

// Generate a simple tree, rotated with provided angles
function tree(angles) {
    var stem = new THREE.Mesh(cubeGeometry, stemMaterial );
    stem.position.set(0, radius + 0.75, 0 );
    stem.scale.set( 0.3, 1.5, 0.3 );

    var leaveDark = new THREE.Mesh(cubeGeometry, leaveDarkMaterial );
    leaveDark.position.set( 0, radius + 1.2, 0 );
    leaveDark.scale.set( 1, 2, 1 );

    var leaveLight = new THREE.Mesh(cubeGeometry, leaveLightMaterial );
    leaveLight.position.set( 0, radius + 1.2, 0 );
    leaveLight.scale.set( 1.4, 0.5, 1.4 );

    var tree = new THREE.Group();
    tree.add( leaveDark );
    tree.add( leaveLight );
    tree.add( stem );

    tree.rotation.set(angles[0], angles[1], angles[2])

    return tree
}

// Generate a random angle triple from [0, 2PI]
function randomAngleTriple() {
  return [
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random()
  ]
}

// Add n trees to scene randomly
function growTrees(n) {
  for (var i = 0; i < n; i++) {
    scene.add(tree(randomAngleTriple()))
  }
}

function init() {
    // Update tree count regularly
    fetchTrees()
    setInterval(fetchTrees, 30000)

    // Set up scene + renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80

    renderer =  new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Create lights, add lights to scene
    var light1 = new THREE.DirectionalLight( 0xDDEED3, 1 );
    var light2 = new THREE.AmbientLight(0x7D7D7D);
    light1.position.set( 0, 0, 1 );

    scene.add(light1);
    scene.add(light2);
    scene.add(planet(radius));

    // Orbital controls (rotation)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.update();
}

function render() {
    requestAnimationFrame( render );
    controls.update();
    renderer.render( scene, camera );
}

init();
render();
