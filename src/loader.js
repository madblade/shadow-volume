import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader';
import {
    AnimationMixer,
    Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, SkinnedMesh,
} from 'three';

import fbx from './data/samba.fbx';
import {createShadowCastingMaterial} from './shadow';
import {snapNormals} from './snapper';

function load(
    scene,
    sceneShadows, shadowCasters, lightPosition,
    mixers
)
{
    new FBXLoader().load(fbx, mesh =>
    {
        let mixer = new AnimationMixer(mesh);
        mixer.clipAction(mesh.animations[0]).play();

        mesh.scale.multiplyScalar(0.1);
        mesh.position.set(5, -25, -10);

        var container = new Group();
        // container.update = delta => mixer.update(delta);

        container.add(mesh);
        mesh.traverse(c => {
            if (c.isMesh)
            {
                let vMesh = new c.constructor(
                    c.geometry,
                    createShadowCastingMaterial(true, lightPosition)
                ); // clone mesh
                vMesh.material.skinning = c.isSkinnedMesh;
                vMesh.scale.multiplyScalar(0.1);
                vMesh.position.set(5, -25, -10);
                snapNormals(vMesh);
                shadowCasters.push(vMesh);
                sceneShadows.add(vMesh);
                vMesh.skeleton = c.skeleton;
            }
        });

        scene.add(container);
        mixers.push(mixer);
    });
}

export { load };
