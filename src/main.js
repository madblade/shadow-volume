
// Partially adapted from
// https://raw.githack.com/dyarosla/shadowVolumeThreeJS/master/index.html

// scene size
import {
    AmbientLight, AnimationMixer, BackSide, BoxBufferGeometry,
    Color, DirectionalLight, DirectionalLightHelper, DoubleSide, FrontSide, Group, Matrix4,
    Mesh, MeshBasicMaterial, MeshPhongMaterial,
    PerspectiveCamera, PlaneBufferGeometry, PointLight, PointLightHelper,
    Scene, ShaderLib, ShaderMaterial, SphereBufferGeometry, TextureLoader, TorusKnotBufferGeometry, UniformsUtils, Vector3, Vector4,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import CasterVertex from './caster.vertex.glsl';

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
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    scene = new Scene();
    sceneShadows = new Scene();
    // scene.background = new Color(0x444444);

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
    gl = renderer.context;
}

function createShadowCastingMaterial()
{
    let customUniforms = UniformsUtils.merge([
        ShaderLib.phong.uniforms,
        {
            lightPosition: { value: lightPosition },
            isShadow1: { value: false },
            isShadow2: { value: false },
            bias: { value: 0.01 },
        }
    ]);

    let material = new ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: `
                #include <common>
                ${CasterVertex}
            `,
        fragmentShader: ShaderLib.phong.fragmentShader,
        lights: true
    });

    return material;
}

function init()
{
    initScene();

    let g = new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    );
    let torus = new Mesh(g, createShadowCastingMaterial());
    torus.scale.multiplyScalar(0.6);
    torus.position.set(-5, -10, 5);
    scene.add(torus);

    let torus2 = new Mesh(new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    ), createShadowCastingMaterial());
    torus2.scale.multiplyScalar(0.5);
    torus2.rotation.set(0, Math.PI / 2, 0);
    torus2.position.set(15, 5, 0);
    scene.add(torus2);

    // g = new SphereBufferGeometry(10, 32, 32);
    // g = new BoxBufferGeometry(10, 10, 10,
    //     20, 20, 20);
    // g.computeVertexNormals();
    // let material = createShadowCastingMaterial();

    let sphere = new Mesh(
        new SphereBufferGeometry(5, 32, 32),
        createShadowCastingMaterial()
    );
    sphere.position.set(0, -15, -15);
    scene.add(sphere);

    let sphere2 = new Mesh(
        new SphereBufferGeometry(5, 32, 32),
        createShadowCastingMaterial()
    );
    sphere2.scale.multiplyScalar(1.5);
    sphere2.position.set(-10, -5, -15);
    scene.add(sphere2);

    shadowCasters = [torus, torus2, sphere, sphere2];
    // shadowCasters = [torus2];//, torus2, sphere, sphere2];
}

function renderShadows()
{
    shadowCasters.forEach(sc => {
        // Render to simpler different scene.
        scene.remove(sc);
        sceneShadows.add(sc);

        // Cast geometry with vertex shader.
        sc.material.uniforms.isShadow1.value = true;
    });

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
    renderer.render(sceneShadows, camera);

    // Cull back faces
    gl.cullFace(gl.BACK);

    // Decrement on depth fail (2nd param)
    gl.stencilOp(gl.KEEP, gl.DECR, gl.KEEP);

    // Render shadow volumes again
    renderer.render(sceneShadows, camera);

    // Redraw against the stencil non-shadowed regions
    // Stencil buffer now reads 0 for non-shadow
    gl.stencilFunc(gl.EQUAL, 0, 0xff);

    // Don't update stencil buffer anymore
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

    // Re-enable writes to the depth and color buffers
    gl.depthMask(true);
    gl.colorMask(true, true, true, true);

    // Restore geometry
    shadowCasters.forEach(sc => {
        sceneShadows.remove(sc);
        scene.add(sc);
        sc.material.uniforms.isShadow1.value = false;
    });
}

function render()
{
    // Clears color, depth and stencil buffers
    renderer.clear();

    // Disable lights to draw ambient pass using .intensity = 0
    // instead of .visible = false to not force a slow shader
    // recomputation.
    lights.forEach(function(l) {
        l.intensity = 0;
    });

    // Render the scene with ambient lights only
    renderer.render(scene, camera);

    // Compute shadows into the stencil buffer.
    renderShadows();

    // Re-enable lights for render
    lights.forEach(function(l) {
        l.intensity = 1;
    });

    // Render scene that's not in shadow with light calculations
    renderer.render(scene, camera);

    // Disable stencil test
    gl.disable(gl.STENCIL_TEST);
}

// let ready = false;
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
    lightPosition.z = Math.cos(time) * 10.0;
    lightPosition.y = Math.cos(time) * Math.sin(time) * 10.0;

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

    // if (ready) mixer.update(delta / 100.0);

    // Update camera rotation and position
    controls.update();

    // Perform.
    render();
}
