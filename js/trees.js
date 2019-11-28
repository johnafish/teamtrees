//
// #TeamTrees Web Version
// John Fish, Nov 2019
//

// Various three.js global variables
var scene,
    camera,
    renderer,
    controls,
    group;

// Tracking tree count
var numTrees;
var curTrees = 0;

// Leaf materials
var leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91E56E });
var leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xA2FF7A });
var stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7D5A4F });
var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

var radius = 35; // Planet radius

// Takes number, formats as currency... stolen from stackoverflow
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// Retrieve trees from wrapapi, update text + grow trees when appropriate
function fetchTrees() {
  $.ajax({
      url: "https://wrapapi.com/use/johnfish/teamtrees/treecount/0.0.1",
      method: "POST",
      data: {
            "wrapAPIKey": "2pV547pBOpkS31aZW9Aw84e7rGRNXcBh"
          }
  }).done(function(data) {
      numTrees = data["data"]["#totalTrees"];
      $("#cash").text("$"+formatNumber(numTrees))
      var diff = Math.floor(numTrees / 10000) - curTrees
      if (diff > 0) {
        curTrees += diff
        growTrees(diff)
      }
  });
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
  alert("You grew some trees");
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
