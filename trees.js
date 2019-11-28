var scene,
    camera,
    renderer,
    controls,
    group;

var numTrees;
var curTrees = 0;

// Leaf materials
var leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91E56E });
var leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xA2FF7A });
var stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7D5A4F });
var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

var radius = 35;

function planet() {
  var groundMaterial = new THREE.MeshLambertMaterial({ color: 0x634b35});
  var planetGeometry = new THREE.SphereGeometry(radius, 100, 100); 
  var planet = new THREE.Mesh(planetGeometry, groundMaterial);
  planet.position.set(0,0,0);
  scene.add(planet)
}

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

function randomAngleTriple() {
  return [
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random()
  ]
}

function growTrees(n) {
  alert("You grew some trees");
  for (var i = 0; i < n; i++) {
    scene.add(tree(randomAngleTriple()))
  }
}

function init() {
    fetchTrees()
    setInterval(fetchTrees, 30000)
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80

    var light1 = new THREE.DirectionalLight( 0xDDEED3, 1 );
    light1.position.set( 0, 0, 1 );

    var light2 = new THREE.AmbientLight(0x7D7D7D);
    scene.add(light1);
    scene.add(light2);
    scene.add(planet());

    renderer =  new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.update();
}

function render() {
    requestAnimationFrame( render );
    controls.update();
    renderer.render( scene, camera );
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

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

init();
render();
