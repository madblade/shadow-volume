/**
 * Model from https://www.mixamo.com/
 */

import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader';
import {
    AnimationMixer,
    Group
} from 'three';

import fbx from './data/samba.fbx';
import {createShadowCastingMaterial} from './shadow';
import {snapNormals} from './snapper';

function moveMesh(mesh)
{
    mesh.scale.multiplyScalar(0.1);
    mesh.position.set(5, -25, -10);
}

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

        moveMesh(mesh);

        let container = new Group();
        container.add(mesh);
        mesh.traverse(c => {
            if (c.isMesh)
            {
                let vMesh = new c.constructor(
                    c.geometry,
                    createShadowCastingMaterial(true, lightPosition)
                ); // clone mesh

                snapNormals(vMesh, 1000.0); // This is probably what you’re looking for
                shadowCasters.push(vMesh);
                sceneShadows.add(vMesh);

                vMesh.material.skinning = c.isSkinnedMesh;
                vMesh.skeleton = c.skeleton;
                moveMesh(vMesh);
            }
        });

        scene.add(container);
        mixers.push(mixer);
    });
}

export { load };
