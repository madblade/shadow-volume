
// Partially adapted from
// https://raw.githack.com/dyarosla/shadowVolumeThreeJS/master/index.html

// scene size
import {
    AmbientLight,
    FrontSide,
    Matrix4,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera, PlaneBufferGeometry, PointLight, PointLightHelper,
    Scene,
    SphereBufferGeometry,
    TorusKnotBufferGeometry,
    Vector3, Vector4,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import { createShadowCastingMaterial } from './shadow';
// import {snapNormals} from './snapper';
import { render } from './render';
import { load } from './loader';

// screen size
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// camera
let VIEW_ANGLE = 90;
let ASPECT = WIDTH / HEIGHT;
let NEAR = 0.1;
let FAR = 5000;

let camera;
let scene;
let sceneShadows;
let renderer;
let controls;
let lightPosition;

let light;
let lightHelper;
let gl;
let ambient;
let shadowCasters = [];
let lights = [];
let mixers = [];

init();
animate();

function addPlanes()
{
    let planes = [];
    let index = 0;
    planes.push(new Mesh(
        new PlaneBufferGeometry(50, 50),
        new MeshPhongMaterial({ color: 0xff0000, side: FrontSide })
    ));
    planes[index].position.set(0, -25, 0);
    planes[index].rotation.x = -Math.PI / 2;
    scene.add(planes[index++]);
    planes.push(new Mesh(
        new PlaneBufferGeometry(50, 50),
        new MeshPhongMaterial({ color: 0x0000ff, side: FrontSide })
    ));
    planes[index].position.set(0,  0, -25);
    scene.add(planes[index++]);
    planes.push(new Mesh(
        new PlaneBufferGeometry(50, 50),
        new MeshPhongMaterial({ color: 0x00ff00, side: FrontSide })
    ));
    planes[index].position.set(-25,  0, 0);
    planes[index].rotation.y = Math.PI / 2;
    scene.add(planes[index++]);
    planes.push(new Mesh(
        new PlaneBufferGeometry(50, 50),
        new MeshPhongMaterial({ color: 0x00ff00, side: FrontSide })
    ));
    planes[index].position.set(25,  0, 0);
    planes[index].rotation.y = -Math.PI / 2;
    scene.add(planes[index++]);
    planes.push(new Mesh(
        new PlaneBufferGeometry(50, 50),
        new MeshPhongMaterial({ color: 0x0000ff, side: FrontSide })
    ));
    planes[index].position.set(0,  0, 25);
    planes[index].rotation.y = Math.PI;
    scene.add(planes[index++]);
}

function initScene()
{
    renderer = new WebGLRenderer({
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    scene = new Scene();
    sceneShadows = new Scene();

    camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 0, 30);

    lightPosition = new Vector3(1, 1, 1);
    light = new PointLight(0xffffff, 0.5);
    light.position.copy(lightPosition);
    lights.push(light);

    scene.add(light);
    lightHelper = new PointLightHelper(light, 5);
    scene.add(lightHelper);

    // Ambient that'll draw the shadowed region
    ambient = new AmbientLight(0x404040);
    scene.add(ambient);

    addPlanes();

    // Resize renderer.
    let resizeCallback =  () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resizeCallback, false);
    window.addEventListener('orientationchange', resizeCallback, false);

    controls = new OrbitControls(camera, renderer.domElement);

    renderer.autoClear = false;
    renderer.autoClearStencil = false;
    renderer.autoClearDepth = false;
    renderer.autoClearColor = false;
    gl = renderer.getContext();
}


function createObjects(isShadow)
{
    let g = new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    );
    let torus = new Mesh(g, createShadowCastingMaterial(isShadow, lightPosition));
    torus.scale.multiplyScalar(0.6);
    torus.position.set(-5, -10, 5);

    let torus2 = new Mesh(new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    ), createShadowCastingMaterial(isShadow, lightPosition));
    torus2.scale.multiplyScalar(0.5);
    torus2.rotation.set(0, Math.PI / 2, 0);
    torus2.position.set(15, 5, 0);

    let torus3 = new Mesh(new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    ), createShadowCastingMaterial(isShadow, lightPosition));
    torus3.scale.multiplyScalar(0.5);
    torus3.rotation.set(0, Math.PI / 2, Math.PI / 2);
    torus3.position.set(-15, 5, 10);

    let sphere = new Mesh(
        new SphereBufferGeometry(5, 32, 32),
        createShadowCastingMaterial(isShadow, lightPosition)
    );
    sphere.position.set(5, -15, 15);

    let sphere2 = new Mesh(
        new SphereBufferGeometry(5, 32, 32),
        createShadowCastingMaterial(isShadow, lightPosition)
    );
    sphere2.scale.multiplyScalar(1.5);
    sphere2.position.set(-10, -5, -15);

    // Boxes need a bit more thinking before they work.
    // Maybe with a bias to project on theta < -PI / 4 and project far away?
    // let box = new Mesh(
    //     new BoxBufferGeometry(10, 10, 10, 10),
    //     createShadowCastingMaterial(isShadow, lightPosition)
    // );
    // box.scale.multiplyScalar(1.5);
    // box.position.set(10, -5, -15);
    // if (isShadow)
    //     snapNormals(box);

    return [torus, torus2, torus3, sphere, sphere2];
}

function init()
{
    initScene();

    let objs = createObjects(false);
    objs.forEach(o => scene.add(o));

    shadowCasters = createObjects(true);
    shadowCasters.forEach(sc => {
        sceneShadows.add(sc);
    });

    load(scene, sceneShadows, shadowCasters, lightPosition, mixers);
}

let time = 0;
let lastTime = window.performance.now();
function animate()
{
    requestAnimationFrame(animate);

    let now = window.performance.now();
    let delta = now - lastTime;
    lastTime = now;
    time += delta * 0.001;
    // time = 0.001;
    lightPosition.x = Math.sin(time) * 10.0;
    lightPosition.z = Math.cos(time) * 10.0 + 4.0;
    lightPosition.y = Math.cos(time) * Math.sin(time) * 10.0;

    // Update light positions from inverse model matrices, for each shadow model.
    shadowCasters.forEach(sc => {
        let tr = sc.matrixWorld;
        let im = new Matrix4();
        im.getInverse(tr);
        let vec = new Vector4();
        vec.set(lightPosition.x, lightPosition.y, lightPosition.z, 1.0);
        vec.applyMatrix4(im);
        sc.material.uniforms.lightPosition.value = vec;
    });
    light.position.copy(lightPosition);

    if (mixers.length) {
        mixers.forEach(m => m.update(delta / 1000.));
    }

    // Update camera rotation and position
    controls.update();

    // Perform.
    render(gl, renderer, scene, sceneShadows, camera, lights);
}
