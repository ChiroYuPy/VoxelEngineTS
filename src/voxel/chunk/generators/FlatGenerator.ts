import {type BlockID, BlockIDs} from "../../BlockTypes.ts";
import {ChunkGenerator} from "../ChunkGenerator.ts";

export class FlatGenerator extends ChunkGenerator {
    protected getBlockType(
        _lx: number, _ly: number, _lz: number,
        _gx: number, gy: number, _gz: number
    ): BlockID {
        if (gy === 16) return BlockIDs.GRASS;
        if (gy < 16) return BlockIDs.DIRT;
        return BlockIDs.AIR;
    }
}