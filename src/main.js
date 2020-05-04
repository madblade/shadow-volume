
// Partially adapted from
// https://raw.githack.com/dyarosla/shadowVolumeThreeJS/master/index.html

// scene size
import {
    AmbientLight, BoxBufferGeometry, // DirectionalLight,
    FrontSide,
    Matrix4,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera, PlaneBufferGeometry, PointLight, PointLightHelper,
    Scene, ShaderLib, ShaderMaterial, SphereBufferGeometry,
    TorusKnotBufferGeometry, UniformsUtils, Vector3, Vector4,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import CasterVertex from './caster.vertex.glsl';
// import CasterFragment from './caster.fragment.glsl';

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

function createShadowCastingMaterial(isShadow)
{
    let customUniforms = UniformsUtils.merge([
        ShaderLib.lambert.uniforms,
        {
            lightPosition: { value: lightPosition },
            isShadow: { value: isShadow },
            bias: { value: -0.1 },
        }
    ]);

    let material = new ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: `
                #include <common>
                ${CasterVertex}
            `,
        fragmentShader:
            // `
            // #include <common>
            // ${CasterFragment}
            // `,
            ShaderLib.lambert.fragmentShader,
        lights: true
    });

    return material;
}

function createObjects(isShadow)
{
    let g = new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    );
    let torus = new Mesh(g, createShadowCastingMaterial(isShadow));
    torus.scale.multiplyScalar(0.6);
    torus.position.set(-5, -10, 5);

    let torus2 = new Mesh(new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    ), createShadowCastingMaterial(isShadow));
    torus2.scale.multiplyScalar(0.5);
    torus2.rotation.set(0, Math.PI / 2, 0);
    torus2.position.set(15, 5, 0);

    let torus3 = new Mesh(new TorusKnotBufferGeometry(
        10, 3,
        200, 25
    ), createShadowCastingMaterial(isShadow));
    torus3.scale.multiplyScalar(0.5);
    torus3.rotation.set(0, Math.PI / 2, Math.PI / 2);
    torus3.position.set(-15, 5, 10);

    let sphere = new Mesh(
        new SphereBufferGeometry(5, 32, 32),
        createShadowCastingMaterial(isShadow)
    );
    sphere.position.set(0, -15, -15);

    let sphere2 = new Mesh(
        new SphereBufferGeometry(5, 32, 32),
        createShadowCastingMaterial(isShadow)
    );
    sphere2.scale.multiplyScalar(1.5);
    sphere2.position.set(-10, -5, -15);

    box = new Mesh(
        new BoxBufferGeometry(10, 10, 10, 10),
        createShadowCastingMaterial(isShadow)
    );
    box.scale.multiplyScalar(1.5);
    box.position.set(10, -5, -15);
    if (isShadow)
        smootheNormals(box);

    return [torus, torus2, torus3, sphere, sphere2, box];
}

let box;
function init()
{
    initScene();

    let objs = createObjects(false);
    objs.forEach(o => scene.add(o));

    let shadows = createObjects(true);
    shadowCasters = shadows;
    shadowCasters.forEach(sc => {
        sceneShadows.add(sc);
    });
}

function renderShadows()
{
    // shadowCasters.forEach(sc => {
    // Render to simpler different scene.
    // scene.remove(sc);
    // sceneShadows.add(sc);

    // Cast geometry with vertex shader.
    // sc.material.uniforms.isShadow.value = true;
    // });

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
    // shadowCasters.forEach(sc => {
    // sceneShadows.remove(sc);
    // scene.add(sc);
    // sc.material.uniforms.isShadow.value = false;
    // });
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

    shadowCasters.forEach(sc => {
        let tr = sc.matrixWorld;
        let im = new Matrix4();
        im.getInverse(tr);
        let vec = new Vector4();
        vec.set(lightPosition.x, lightPosition.y, lightPosition.z, 1.0);
        vec.applyMatrix4(im);
        sc.material.uniforms.lightPosition.value = vec;
    });
    box.material.uniforms.lightPosition.value = lightPosition;
    light.position.copy(lightPosition);

    // Update camera rotation and position
    controls.update();

    // Perform.
    render();
}

function smootheNormals(mesh)
{
    let g = mesh.geometry;
    let p = g.attributes.position;
    let n = g.attributes.normal.array;
    let nbVertices = p.count;

    // Sort
    let sorted = [];
    let maxs = [-Infinity, -Infinity, -Infinity];
    let mins = [Infinity, Infinity, Infinity];
    let bufferPositions = p.array; let stride;
    for (let i = 0; i < nbVertices; ++i) {
        stride = 3 * i;
        let x = bufferPositions[stride];
        let y = bufferPositions[stride + 1];
        let z = bufferPositions[stride + 2];
        maxs[0] = maxs[0] < x ? x : maxs[0];
        maxs[1] = maxs[1] < y ? y : maxs[1];
        maxs[2] = maxs[2] < z ? z : maxs[2];
        mins[0] = mins[0] > x ? x : mins[0];
        mins[1] = mins[1] > y ? y : mins[1];
        mins[2] = mins[2] > z ? z : mins[2];
        sorted.push([x, y, z, i]);
    }
    sorted.sort((a, b) => a[0] - b[0]);
    // console.log(sorted);

    // Compute extent
    let xE = maxs[0] - mins[0];
    let yE = maxs[1] - mins[1];
    let zE = maxs[2] - mins[2];
    let snapDistance = Math.sqrt(Math.pow(xE, 2) + Math.pow(yE, 2) + Math.pow(zE, 2)) / 1000.0;
    let maxDeltaX = snapDistance; // xE / 1000.0; // Manhattan on x

    // Smoothe normals
    let processed = new Uint8Array(nbVertices);
    processed.fill(0);
    let numberSnapLocii = 0;
    let nbWarns = 0;
    for (let i = 0; i < nbVertices; ++i)
    {
        if (processed[i]) continue;
        let currentPoint = sorted[i];
        let xc = currentPoint[0];
        let yc = currentPoint[1];
        let zc = currentPoint[2];

        let currentXDistance = 0;
        let colocalized = [];
        let j = i + 1;
        while (currentXDistance < maxDeltaX && j !== nbVertices) {
            let nextPoint = sorted[j];
            if (processed[j]) { ++j; continue; }

            let xn = nextPoint[0];
            let yn = nextPoint[1];
            let zn = nextPoint[2];

            currentXDistance = xn - xc; // > 0
            if (currentXDistance > maxDeltaX) break;

            let distance3D = Math.sqrt(Math.pow(xc - xn, 2) + Math.pow(yc - yn, 2) + Math.pow(zc - zn, 2));
            if (distance3D < snapDistance) {
                // console.log(`${i} (${xc},${yc},${zc}) -> ${j} (${xn},${yn},${zn})`);
                colocalized.push(nextPoint[3]);
                processed[j] = 1;
            }

            ++j;
        }

        // Recompute normal
        if (colocalized.length) {
            ++numberSnapLocii;
            let ni = currentPoint[3];
            let currentNormal = [n[3 * ni], n[3 * ni + 1], n[3 * ni + 2]];
            let nbNormals = colocalized.length + 1;

            if (colocalized.length > 5) {
                ++nbWarns;
            }

            // Average normals
            for (let k = 0; k < colocalized.length; ++k) {
                let nk = colocalized[k];
                currentNormal[0] += n[3 * nk];
                currentNormal[1] += n[3 * nk + 1];
                currentNormal[2] += n[3 * nk + 2];
            }
            currentNormal[0] /= nbNormals;
            currentNormal[1] /= nbNormals;
            currentNormal[2] /= nbNormals;

            console.log(currentNormal);

            // Replace normals in attribute array.
            n[3 * ni] = currentNormal[0];
            n[3 * ni + 1] = currentNormal[1];
            n[3 * ni + 2] = currentNormal[2];
            for (let k = 0; k < colocalized.length; ++k) {
                let nk = colocalized[k];
                n[3 * nk] = currentNormal[0];
                n[3 * nk + 1] = currentNormal[1];
                n[3 * nk + 2] = currentNormal[2];
            }
        }
    }

    if (numberSnapLocii > 0)
        console.log(`Snapped ${numberSnapLocii} locations.`);
    if (nbWarns > 0)
        console.log(`${nbWarns} snaps done on more than 5 points.`);

    mesh.geometry.attributes.normal.needsUpdate = true;
}
