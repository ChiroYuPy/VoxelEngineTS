import * as THREE from "three";
import { VOXEL_SIZE, CHUNK_SIZE } from "../../constants.ts";
import { Chunk } from "./Chunk.ts";
import {type BlockID, BlockIDs, getColor} from "../BlockTypes.ts";

export class ChunkMesher {
    static buildMesh(chunk: Chunk, scene: THREE.Scene): THREE.Mesh[] {
        const voxels = chunk.getVoxelData();
        if (!voxels) {
            console.warn("buildMesh called without voxel data.");
            return [];
        }

        // Supprime les anciens meshes
        for (const mesh of chunk.meshes) {
            scene.remove(mesh);
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
            else mesh.material.dispose();
        }

        const base = chunk.getWorldPosition();
        const S = VOXEL_SIZE;

        const positions: number[] = [];
        const normals: number[] = [];
        const colors: number[] = [];
        const indices: number[] = [];

        const faces = [
            { normal: [0, 1, 0], offset: [0, 1, 0], vertices: (x: number, y: number, z: number) => [x, y + S, z, x + S, y + S, z, x + S, y + S, z + S, x, y + S, z + S], indices: [0, 2, 1, 0, 3, 2] },
            { normal: [0, -1, 0], offset: [0, -1, 0], vertices: (x: number, y: number, z: number) => [x, y, z, x + S, y, z, x + S, y, z + S, x, y, z + S], indices: [0, 1, 2, 0, 2, 3] },
            { normal: [1, 0, 0], offset: [1, 0, 0], vertices: (x: number, y: number, z: number) => [x + S, y, z, x + S, y + S, z, x + S, y + S, z + S, x + S, y, z + S], indices: [0, 1, 2, 0, 2, 3] },
            { normal: [-1, 0, 0], offset: [-1, 0, 0], vertices: (x: number, y: number, z: number) => [x, y, z, x, y + S, z, x, y + S, z + S, x, y, z + S], indices: [0, 2, 1, 0, 3, 2] },
            { normal: [0, 0, 1], offset: [0, 0, 1], vertices: (x: number, y: number, z: number) => [x, y, z + S, x, y + S, z + S, x + S, y + S, z + S, x + S, y, z + S], indices: [0, 2, 1, 0, 3, 2] },
            { normal: [0, 0, -1], offset: [0, 0, -1], vertices: (x: number, y: number, z: number) => [x, y, z, x, y + S, z, x + S, y + S, z, x + S, y, z], indices: [0, 1, 2, 0, 2, 3] },
        ];

        let vertexIndex = 0;
        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                for (let z = 0; z < CHUNK_SIZE; z++) {
                    const block = chunk.data.getVoxel(x, y, z);
                    if (block === BlockIDs.AIR) continue;

                    const col = getColor(block as BlockID) ?? new THREE.Color(1, 1, 1);
                    const r = (col as THREE.Color).r;
                    const g = (col as THREE.Color).g;
                    const b = (col as THREE.Color).b;

                    const gx = base.x + x * S;
                    const gy = base.y + y * S;
                    const gz = base.z + z * S;

                    for (const face of faces) {
                        const [dx, dy, dz] = face.offset;
                        const neighbor = chunk.getBlockForMeshing(x + dx, y + dy, z + dz);
                        if (neighbor !== BlockIDs.AIR) continue;

                        // vertices & normales
                        const verts = face.vertices(gx, gy, gz);
                        positions.push(...verts);
                        normals.push(...face.normal, ...face.normal, ...face.normal, ...face.normal);

                        // couleur par sommet
                        for (let i = 0; i < 4; i++) {
                            colors.push(r, g, b);
                        }

                        // indices
                        indices.push(...face.indices.map(i => i + vertexIndex));
                        vertexIndex += 4;
                    }
                }
            }
        }

        // Construction du BufferGeometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);

        // Shader qui applique la couleur par sommet
        const material = new THREE.ShaderMaterial({
            vertexColors: true,
            vertexShader: `
                varying vec3 vColor;
                varying vec3 vNormal;
                void main() {
                    vColor = color;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying vec3 vNormal;
                void main() {
                    float light = dot(normalize(vNormal), vec3(0.4, 1.0, 0.5));
                    light = clamp(light, 0.2, 1.0);
                    gl_FragColor = vec4(vColor * light, 1.0);
                }
            `,
            transparent: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        chunk.meshes = [mesh];
        return [mesh];
    }
}
