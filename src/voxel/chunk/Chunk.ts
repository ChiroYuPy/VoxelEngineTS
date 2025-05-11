import * as THREE from "three";
import { CHUNK_SIZE } from "../../constants.ts";
import { VoxelWorld } from "../VoxelWorld.ts";
import { ChunkData } from "./ChunkData.ts";
import { WorldGenerator } from "../WorldGenerator.ts";
import { ChunkMesher } from "./ChunkMesher.ts";


export class Chunk {
    readonly data: ChunkData;
    public meshes: THREE.Mesh[] = [];
    private readonly coordinate: THREE.Vector3;
    private world: VoxelWorld;
    private dirty: boolean;
    private generator: WorldGenerator;

    public setDirty(): void {
        this.dirty = true;
    }

    public isDirty(): boolean {
        return this.dirty;
    }

    constructor(coordinate: THREE.Vector3, generator: WorldGenerator, world: VoxelWorld) {
        this.coordinate = coordinate;
        this.generator = generator;
        this.world = world;
        this.dirty = true;
        this.data = new ChunkData();
    }

    generate(): void {
        this.generator.generate(this.data, this.coordinate);
        this.dirty = true;
    }

    buildMesh(scene: THREE.Scene): void {
        if (!this.dirty) return;
        this.meshes.forEach(m => scene.remove(m)); // clean
        this.meshes = ChunkMesher.buildMesh(this, scene);
        this.meshes.forEach(m => scene.add(m));
        this.dirty = false;
    }

    public getWorldPosition(): THREE.Vector3 {
        return new THREE.Vector3(
            this.coordinate.x * CHUNK_SIZE,
            this.coordinate.y * CHUNK_SIZE,
            this.coordinate.z * CHUNK_SIZE
        );
    }

    public getVoxelData(): Uint8Array<ArrayBuffer> {
        return this.data.getVoxels();
    }

    public getBlockForMeshing(x: number, y: number, z: number): number {
        return this.getNeighborBlock(x, y, z);
    }

    public getNeighborBlock(x: number, y: number, z: number): number {
        const size = CHUNK_SIZE;

        if (x >= 0 && x < size && y >= 0 && y < size && z >= 0 && z < size) return this.data.getVoxel(x, y, z);

        const nx = this.coordinate.x + Math.floor(x / size);
        const ny = this.coordinate.y + Math.floor(y / size);
        const nz = this.coordinate.z + Math.floor(z / size);

        const localX = ((x % size) + size) % size;
        const localY = ((y % size) + size) % size;
        const localZ = ((z % size) + size) % size;

        const neighbor = this.world.getChunkAt(nx, ny, nz);
        if (!neighbor) return 0; // if not loaded, take it as an air filled chunk

        return neighbor.data.getVoxel(localX, localY, localZ);
    }
}