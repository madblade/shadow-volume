
// scene size
import {
    Color, DirectionalLight, DoubleSide,
    Mesh, MeshBasicMaterial, MeshPhongMaterial,
    PerspectiveCamera, PlaneBufferGeometry, PointLight,
    Scene, ShaderMaterial, TorusKnotBufferGeometry, Vector3,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import CasterVertex from './caster.vertex.glsl';
import CasterFragment from './caster.fragment.glsl';

// screen size
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// camera
let VIEW_ANGLE = 90;
let ASPECT = WIDTH / HEIGHT;
let NEAR = 0.1; // precision
let FAR = 5000;

let torus;
let camera;
let scene;
let renderer;
let controls;
let lightPosition;

init();
animate();

function initScene()
{
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    scene = new Scene();
    scene.background = new Color(0x444444);

    camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 0, 30);

    // let lights = [];
    // lights[0] = new PointLight(0xffffff, 1, 0);
    // lights[1] = new PointLight(0xffffff, 1, 0);
    // lights[2] = new PointLight(0xffffff, 1, 0);
    // lights[0].position.set(0, 200, 0);
    // lights[1].position.set(100, 200, 100);
    // lights[2].position.set(-100, -200, -100);
    // scene.add(lights[0]);
    // scene.add(lights[1]);
    // scene.add(lights[2]);
    lightPosition = new Vector3(1, 1, 1);
    let light = new DirectionalLight(0xffffff, 1);
    light.position.copy(lightPosition);
    scene.add(light);

    let pm1 = new Mesh(
        new PlaneBufferGeometry(50, 50),
        new MeshPhongMaterial({ color: 0xff0000, side: DoubleSide })
    );
    pm1.position.set(0, -25, 0);
    pm1.rotation.x = Math.PI / 2;
    scene.add(pm1);
    let pm2 = new Mesh(
        new PlaneBufferGeometry(50, 50),
        new MeshPhongMaterial({ color: 0x0000ff, side: DoubleSide })
    );
    pm2.position.set(0,  0, -25);
    pm2.rotation.y = Math.PI;
    scene.add(pm2);
    let pm3 = new Mesh(
        new PlaneBufferGeometry(50, 50),
        new MeshPhongMaterial({ color: 0x00ff00, side: DoubleSide })
    );
    pm3.position.set(-25,  0, 0);
    pm3.rotation.y = Math.PI / 2;
    scene.add(pm3);

    // Resize renderer.
    let resizeCallback =  () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resizeCallback, false);
    window.addEventListener('orientationchange', resizeCallback, false);

    // HERE.
    controls = new OrbitControls(camera, renderer.domElement);
}

function init()
{
    initScene();

    let g = new TorusKnotBufferGeometry(10, 3, 100, 16);
    let m = new MeshPhongMaterial({ color: 0x2194CE, shininess: 1 });

    m = new ShaderMaterial({
        uniforms: {
            lightPosition: { value: lightPosition }
        },
        vertexShader: CasterVertex,
        fragmentShader: CasterFragment
    });

    torus = new Mesh(g, m);
    scene.add(torus);
}

function render()
{
    renderer.render(scene, camera);
}

function animate()
{
    requestAnimationFrame(animate);

    // Update camera rotation and position
    controls.update();

    // Render
    render();
}
