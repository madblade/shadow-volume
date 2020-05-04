import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader';
import {
    AnimationMixer,
    Group, Mesh,
} from 'three';

import fbx from './data/samba.fbx';
import {createShadowCastingMaterial} from './shadow';
import {snapNormals} from './snapper';

function load(scene, sceneShadows, lightPosition)
{
    new FBXLoader().load(fbx, mesh =>
    {
        let mixer = new AnimationMixer(mesh);
        mixer.clipAction(mesh.animations[0]).play();

        mesh.scale.multiplyScalar(0.2);
        mesh.position.y = -15;

        var container = new Group();
        container.update = delta => mixer.update(delta);

        container.add(mesh);
        mesh.traverse(c => {
            if (c.isMesh)
            {
                let vMesh = new Mesh(
                    c.geometry,
                    // c.material
                    createShadowCastingMaterial(true, lightPosition)
                ); // clone mesh
                vMesh.scale.multiplyScalar(0.1);
                vMesh.position.set(10, -2, -15);
                // snapNormals(vMesh);

                // sceneShadows.add(vMesh);
                scene.add(vMesh);

                // TODO make shadow volume
                // container.add(vsm);
                // TODO add to scene.
            }
        });

        // scene.add(container);
    });
}

export { load };
