/**
 * Stencil shadows rendering.
 */

function render(
    gl, renderer, scene, sceneShadows, camera, lights
)
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
    renderShadows(
        gl, renderer, sceneShadows, camera
    );

    // Re-enable lights for render
    lights.forEach(function(l) {
        l.intensity = 1;
    });

    // Render scene that's not in shadow with light calculations
    renderer.render(scene, camera);

    // Disable stencil test
    gl.disable(gl.STENCIL_TEST);
}

function renderShadows(
    gl, renderer, sceneShadows, camera
)
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

export { render };