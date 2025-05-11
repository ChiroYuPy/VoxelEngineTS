import {type BlockID, BlockIDs} from "../data/BlockTypes.ts";
import {WorldGenerator} from "../WorldGenerator.ts";

export class FlatGenerator extends WorldGenerator {
    protected getBlockType(
        _lx: number, _ly: number, _lz: number,
        _gx: number, gy: number, _gz: number
    ): BlockID {
        if (gy === 16) return BlockIDs.GRASS;
        if (gy < 16) return BlockIDs.DIRT;
        return BlockIDs.AIR;
    }
}