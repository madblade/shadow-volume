
# Fast Shadow Volumes

[Demo](https://madblade.github.io/shadow-volume/)

![](https://raw.githubusercontent.com/madblade/shadow-volume/master/img/capture.jpg)

## Features
- Fast! CPU and GPU efficient
- Only one geometry clone, no additional geometry created
- Works on skinned meshes

## Approach
- Clone the geometry into a new shadow mesh (SM)
- Snap normals on the SM to avoid holes during the projection
- Project the back of the SM using normals
- Use normals to resize the rest of the SM (avoids self-shadowing artifacts)

## Improvements
- Bridge edges near every vertex where normals disagree to remove projection artifacts
- Sharp edges (i.e. BoxBufferGeometry)
- Adaptive normal resizing for thin geometries (using attributes?)
- Only works for closed surfaces (manifolds) so far

## See also

Related approach with more geometry involved:
https://github.com/gkjohnson/threejs-sandbox/tree/master/shadow-volumes

Stencil part adapted from:
https://raw.githack.com/dyarosla/shadowVolumeThreeJS/master/index.html

Shadow Volumes reference:
http://nuclear.mutantstargoat.com/articles/volume_shadows_tutorial_nuclear.pdf

Demo character from:
https://www.mixamo.com/
