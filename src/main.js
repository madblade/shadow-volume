
// scene size
import {
    AmbientLight, AnimationMixer, BackSide, BoxBufferGeometry,
    Color, DirectionalLight, DoubleSide, FrontSide, Group,
    Mesh, MeshBasicMaterial, MeshPhongMaterial,
    PerspectiveCamera, PlaneBufferGeometry, PointLight,
    Scene, ShaderLib, ShaderMaterial, SphereBufferGeometry, TextureLoader, TorusKnotBufferGeometry, UniformsUtils, Vector3,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import CasterVertex from './caster.vertex.glsl';
import CasterFragment from './caster.fragment.glsl';
import {VertexNormalsHelper} from 'three/examples/jsm/helpers/VertexNormalsHelper';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

// import fbx from './data/samba.fbx';
// import glb from './data/samba.glb';
// import glb from './data/samba-remeshed-16k.glb';
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

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
let sceneVolume;
let renderer;
let controls;
let lightPosition;

let mixer;
let dancer;
let gl;
let lights = [];
let ambient;
let uniforms1 = [];
let uniforms2 = [];

init();
animate();

function initScene()
{
    renderer = new WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    scene = new Scene();
    scene.background = new Color(0x444444);
    sceneVolume = new Scene();

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
    let light = new DirectionalLight(0xffffff, 1.0);
    light.position.copy(lightPosition);
    lights.push(light);
    scene.add(light);

    // Ambient that'll draw the shadowed region
    ambient = new AmbientLight(0x404040);
    scene.add(ambient);

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

    controls = new OrbitControls(camera, renderer.domElement);

    renderer.autoClear = false;
    renderer.autoClearStencil = false;
    renderer.autoClearDepth = false;
    renderer.autoClearColor = false;
    gl = renderer.getContext();
}

function loadModel()
{
    const url = 'https://rawgit.com/mrdoob/three.js/r100/examples/models/fbx/Samba Dancing.fbx';

    // new GLTFLoader().load(glb, scn =>
    // new GLTFLoader().load(url, scn =>
    new FBXLoader().load(url, scn =>
    {
        console.log(scn);
        let mesh = scn.scene.children[0];
        console.log(mesh);

        mesh.scale.multiplyScalar(20.0);
        mesh.position.y = -15;
        console.log('loaded');
        mixer = new AnimationMixer(mesh);
        mixer.clipAction(scn.animations[0]).play();

        let c = mesh.children[1];
        // mesh.traverse(c => {
        if (c.isMesh) {
            c.geometry.computeVertexNormals();
            let mat =
                new ShaderMaterial({
                    uniforms: {
                        lightPosition: { value: lightPosition },
                        isShadow1: { value: false },
                        isShadow2: { value: false },
                        bias: { value: 0.01 }
                    },
                    vertexShader: CasterVertex,
                    fragmentShader: CasterFragment
                });
            mat.morphTargets = true;
            c.material = mat;
            uniforms1.push(mat.uniforms.isShadow1);
            uniforms2.push(mat.uniforms.isShadow2);

            // let nh = new VertexNormalsHelper(c);
            // scene.add(nh);

            c.scale.multiplyScalar(21.2);
            c.position.y = -15;
        }
        // });

        // dancer = new Group();
        // dancer.update = delta => mixer.update(delta);
        // addMesh(mesh, container);
        // displayOptions.push(container);
        dancer = c;
        scene.add(c);
        ready = true;
    }, undefined, error => {
        console.log(error);
        console.log('failed to load');
    });
}

function init()
{
    initScene();

    let g = new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    );
    let m = new MeshPhongMaterial({ color: 0x2194CE, shininess: 1 });

    // g = new SphereBufferGeometry(10, 32, 32);
    // g = new BoxBufferGeometry(10, 10, 10,
    //     20, 20, 20);
    // g.computeVertexNormals();
    m = new ShaderMaterial({
        uniforms: {
            lightPosition: { value: lightPosition },
            isShadow1: { value: false },
            isShadow2: { value: false },
            bias: { value: 0.2 }
        },
        vertexShader: CasterVertex,
        fragmentShader: CasterFragment
    });
    uniforms1.push(m.uniforms.isShadow1);
    uniforms2.push(m.uniforms.isShadow2);

    torus = new Mesh(g, m);
    // scene.add(torus);

    let torus2 = torus.clone(true);
    let customUniforms = UniformsUtils.merge([
        ShaderLib.phong.uniforms,
        {
            lightPosition: { value: new Vector3(0, 0, 10) },
            isShadow1: { value: false },
            isShadow2: { value: false },
            bias: { value: 0.2 }
        }
    ]);
    torus2.material =
        new ShaderMaterial({
            uniforms: customUniforms,
            vertexShader: `
                #include <common>
                ${CasterVertex}
            `,
            fragmentShader: ShaderLib.phong.fragmentShader,
            lights: true
        });
    torus2.material.depthWrite = true;
    scene.add(torus2);
    torus2.position.set(0, 0, -20);
    // sceneVolume.add(torus);
    // let helper = new VertexNormalsHelper(torus, 2, 0x00ff00, 1);
    // scene.add(helper);
}

function renderShadows(uniforms)
{
    // scene.remove(torus);
    sceneVolume.add(torus);
    uniforms.forEach(u => { u.value = true; });
    // torus.material.uniforms.isShadow.value = true;

    // Enable stencils
    gl.enable(gl.STENCIL_TEST);

    // Config the stencil buffer to test each fragment
    gl.stencilFunc(gl.ALWAYS, 1, 0xff);

    // Disable writes to depth buffer and color buffer
    // Only want to write to stencil
    gl.depthMask(false);
    gl.colorMask(false, false, false, false);

    // Begin depth fail algorithm for stencil updates

    // Cull front faces
    gl.cullFace(gl.FRONT);

    // Increment on depth fail (2nd param)
    gl.stencilOp(gl.KEEP, gl.INCR, gl.KEEP);

    // Render shadow volumes
    renderer.render(sceneVolume, camera);

    // Cull back faces
    gl.cullFace(gl.BACK);

    // Decrement on depth fail (2nd param)
    gl.stencilOp(gl.KEEP, gl.DECR, gl.KEEP);

    // Render shadow volumes again
    renderer.render(sceneVolume, camera);

    // Redraw against the stencil non-shadowed regions
    // Stencil buffer now reads 0 for non-shadow
    gl.stencilFunc(gl.EQUAL, 0, 0xff);

    // Don't update stencil buffer anymore
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

    // Re-enable writes to the depth and color buffers
    gl.depthMask(true);
    gl.colorMask(true, true, true, true);

    // torus.material.uniforms.isShadow.value = false;
    uniforms.forEach(u => { u.value = false; });
    sceneVolume.remove(torus);
    // scene.add(torus);
}

function render()
{
    // Clears color, depth and stencil buffers
    renderer.clear();

    // Disable lights to draw ambient pass using .intensity = 0
    // instead of .visible = false to not force a slow shader
    // recomputation.
    lights.forEach(function(light) {
        light.intensity = 0;
    });

    // Render the scene with ambient lights only
    renderer.render(scene, camera);

    renderShadows(uniforms1);
    // renderShadows(uniforms2);

    // Clear depth test - may not be required
    // renderer.clear(false, true, false);

    // Re-enable lights for render
    lights.forEach(function(light) {
        light.intensity = 1;
    });

    // Render scene that's not in shadow with light calculations
    renderer.render(scene, camera);

    // Disable stencil test
    gl.disable(gl.STENCIL_TEST);
}

let ready = false;
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
    lightPosition.x = Math.sin(time) * 100.0;
    lightPosition.z = Math.cos(time) * 100.0;
    lightPosition.y = Math.cos(time) * Math.sin(time) * 100.0;

    if (ready) mixer.update(delta / 100.0);

    // Update camera rotation and position
    controls.update();

    // Render
    render();
}
