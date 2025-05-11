import { CHUNK_SIZE, CHUNK_AREA, CHUNK_VOLUME } from "../../constants.ts";

export class ChunkData {
    private readonly voxels: Uint8Array;

    constructor(voxels = new Uint8Array(CHUNK_VOLUME)) {
        this.voxels = voxels;
    }

    getIndex(x: number, y: number, z: number): number {
        return x + y * CHUNK_SIZE + z * CHUNK_AREA;
    }

    getVoxel(x: number, y: number, z: number): number {
        return this.voxels[this.getIndex(x, y, z)];
    }

    setVoxel(x: number, y: number, z: number, value: number): void {
        this.voxels[this.getIndex(x, y, z)] = value;
    }

    getVoxels(): Uint8Array {
        return this.voxels;
    }
}
