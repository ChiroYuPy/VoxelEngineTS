import { CHUNK_SIZE } from "../../constants.ts";
import type { BlockID } from "../BlockTypes.ts";
import type { ChunkData } from "./ChunkData.ts";

export abstract class ChunkGenerator {
    constructor(_seed?: number) {}

    generate(chunkData: ChunkData, worldCoord: { x: number; y: number; z: number }): void {
        const { x: cx, y: cy, z: cz } = worldCoord;

        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
            for (let ly = 0; ly < CHUNK_SIZE; ly++) {
                for (let lz = 0; lz < CHUNK_SIZE; lz++) {
                    const gx = cx * CHUNK_SIZE + lx;
                    const gy = cy * CHUNK_SIZE + ly;
                    const gz = cz * CHUNK_SIZE + lz;

                    const type = this.getBlockType(lx, ly, lz, gx, gy, gz);
                    chunkData.setVoxel(lx, ly, lz, type);
                }
            }
        }
    }

    protected abstract getBlockType(
        lx: number, ly: number, lz: number,
        gx: number, gy: number, gz: number
    ): BlockID;
}