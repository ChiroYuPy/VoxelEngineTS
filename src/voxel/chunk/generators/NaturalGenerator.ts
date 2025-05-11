import {createNoise2D, createNoise3D, type NoiseFunction2D, type NoiseFunction3D} from "simplex-noise";
import {CHUNK_HEIGHT_SCALE, CHUNK_SIZE} from "../../../constants.ts";
import {type BlockID, BlockIDs} from "../../BlockTypes.ts";
import {ChunkGenerator} from "../ChunkGenerator.ts";

export class NaturalGenerator extends ChunkGenerator {
    private readonly noise2D: NoiseFunction2D;
    private readonly noise3D: NoiseFunction3D;
    private readonly terrainScale = CHUNK_SIZE * 4;
    private readonly caveScale = CHUNK_SIZE * 2;

    constructor(seed: number) {
        super(seed);

        const rng = (() => {
            let s = seed;
            return (): number => {
                s = (1664525 * s + 1013904223) >>> 0;
                return (s / 0x100000000) - 0.5;
            };
        })();

        this.noise2D = createNoise2D(rng);
        this.noise3D = createNoise3D(rng);
    }

    protected getBlockType(
        _lx: number, _ly: number, _lz: number,
        gx: number, gy: number, gz: number
    ): BlockID {
        const height = this.generateHeight(gx, gz);
        if (gy < height && !this.isCave(gx, gy, gz)) {
            if (gy < height - 6) return BlockIDs.STONE;
            if (gy < height - 2) return BlockIDs.DIRT;
            return BlockIDs.GRASS;
        }
        return BlockIDs.AIR;
    }

    private generateHeight(x: number, z: number): number {
        const h = (this.noise2D(x / this.terrainScale, z / this.terrainScale) + 1) * 0.5;
        return 32 + h * (64 - 32);
    }

    private isCave(x: number, y: number, z: number): boolean {
        let value = 0;
        let amplitude = 1;
        let frequency = 1 / this.caveScale;

        for (let o = 0; o < 4; o++) {
            value += this.noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
            amplitude *= 0.5;
            frequency *= 2;
        }

        const threshold = 0.5 - (y / (CHUNK_HEIGHT_SCALE * 2));
        return value > threshold;
    }
}
