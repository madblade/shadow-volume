/**
 * Normal vector field smoother.
 * (c) madblade 2020
 *
 * Complexity — O(n x n^1/3) assuming uniform sampling of vertices.
 * Preprocesses shadow mesh normals.
 * This prevents faces from dissociating in optimized models.
 */
function snapNormals(mesh)
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

    // Compute extent
    let xE = maxs[0] - mins[0];
    let yE = maxs[1] - mins[1];
    let zE = maxs[2] - mins[2];
    let snapDistance = Math.sqrt(
        Math.pow(xE, 2) +
        Math.pow(yE, 2) +
        Math.pow(zE, 2)
    ) / 1000.0;
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

            let distance3D = Math.sqrt(
                Math.pow(xc - xn, 2) +
                Math.pow(yc - yn, 2) +
                Math.pow(zc - zn, 2)
            );
            if (distance3D < snapDistance) {
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

export { snapNormals };
