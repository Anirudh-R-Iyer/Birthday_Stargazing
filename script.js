const container = document.getElementById('canvas-container');

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Add orbit controls for interactivity
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

// Fetch and process the CSV data
fetch('assets/stars.csv')
  .then(response => response.text())
  .then(data => {
    const stars = Papa.parse(data, { header: true }).data;
    addStarsToScene(stars);
  })
  .catch(error => {
    console.error('Error fetching the CSV file:', error);
  });

// Add stars to the scene
function addStarsToScene(stars) {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
  });

  const positions = [];

  stars.forEach(star => {
    const ra = parseFloat(star["RA(deg)"]) * (Math.PI / 180); // Convert RA to radians
    const dec = parseFloat(star["Dec(deg)"]) * (Math.PI / 180);
    const distance = 1 / parseFloat(star["VTMag"]); // Approximate distance based on magnitude

    // Convert spherical to Cartesian coordinates
    const x = distance * Math.cos(dec) * Math.cos(ra);
    const y = distance * Math.cos(dec) * Math.sin(ra);
    const z = distance * Math.sin(dec);

    positions.push(x, y, z);
  });

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const starsMesh = new THREE.Points(starGeometry, starMaterial);
  scene.add(starsMesh);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
