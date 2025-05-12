export const BlockIDs = {
    AIR: 0,
    GRASS: 1,
    DIRT: 2,
    STONE: 3,
    SAND: 4,
    OAK_WOOD: 5,
    OAK_LEAVES: 6,
    WATER: 7,
    LAVA: 8,
    COAL_ORE: 9,
    IRON_ORE: 10,
    GOLD_ORE: 11,
    DIAMOND_ORE: 12,
    LAPIS_ORE: 13,
    COPPER_ORE: 14,
    SNOW: 15,
    FURNACE: 16,
    WOOD_PLANKS: 17,
    STONE_BRICKS: 18,
    TNT: 19,
    FLOWER: 20,
    BUSH: 21,
    CACTUS: 22,
    ICE: 23,
    BRICK: 24,
    LEAVES: 25,
    GRAVEL: 26,
} as const;

export type BlockID = typeof BlockIDs[keyof typeof BlockIDs];

export type BlockData = {
    name: string;
    textureId: number;
    solid: boolean;
};

export function getTextureId(id: BlockID): number {
    const blockData = BlockTypes[id];
    return blockData.textureId;
}

export const BlockTypes: { [key in BlockID]: BlockData } = {
    [BlockIDs.AIR]: {
        name: "Air",
        textureId: -1,
        solid: false,
    },
    [BlockIDs.GRASS]: {
        name: "Grass",
        textureId: 0,
        solid: true,
    },
    [BlockIDs.DIRT]: {
        name: "Dirt",
        textureId: 1,
        solid: true,
    },
    [BlockIDs.STONE]: {
        name: "Stone",
        textureId: 2,
        solid: true,
    },
    [BlockIDs.SAND]: {
        name: "Sand",
        textureId: 3,
        solid: true,
    },
    [BlockIDs.OAK_WOOD]: {
        name: "Oak Wood",
        textureId: 4,
        solid: true,
    },
    [BlockIDs.OAK_LEAVES]: {
        name: "Oak Leaves",
        textureId: 5,
        solid: true,
    },
    [BlockIDs.WATER]: {
        name: "Water",
        textureId: 6,
        solid: false,
    },
    [BlockIDs.LAVA]: {
        name: "Lava",
        textureId: 7,
        solid: false,
    },
    [BlockIDs.COAL_ORE]: {
        name: "Coal Ore",
        textureId: 8,
        solid: true,
    },
    [BlockIDs.IRON_ORE]: {
        name: "Iron Ore",
        textureId: 9,
        solid: true,
    },
    [BlockIDs.GOLD_ORE]: {
        name: "Gold Ore",
        textureId: 10,
        solid: true,
    },
    [BlockIDs.DIAMOND_ORE]: {
        name: "Diamond Ore",
        textureId: 11,
        solid: true,
    },
    [BlockIDs.LAPIS_ORE]: {
        name: "Lapis Ore",
        textureId: 12,
        solid: true,
    },
    [BlockIDs.COPPER_ORE]: {
        name: "Copper Ore",
        textureId: 13,
        solid: true,
    },
    [BlockIDs.SNOW]: {
        name: "Snow",
        textureId: 14,
        solid: true,
    },
    [BlockIDs.FURNACE]: {
        name: "Furnace",
        textureId: 15,
        solid: true,
    },
    [BlockIDs.WOOD_PLANKS]: {
        name: "Wood Planks",
        textureId: 16,
        solid: true,
    },
    [BlockIDs.STONE_BRICKS]: {
        name: "Stone Bricks",
        textureId: 17,
        solid: true,
    },
    [BlockIDs.TNT]: {
        name: "TNT",
        textureId: 18,
        solid: true,
    },
    [BlockIDs.FLOWER]: {
        name: "Flower",
        textureId: 19,
        solid: true,
    },
    [BlockIDs.BUSH]: {
        name: "Bush",
        textureId: 20,
        solid: true,
    },
    [BlockIDs.CACTUS]: {
        name: "Cactus",
        textureId: 21,
        solid: true,
    },
    [BlockIDs.ICE]: {
        name: "Ice",
        textureId: 22,
        solid: true,
    },
    [BlockIDs.BRICK]: {
        name: "Brick",
        textureId: 23,
        solid: true,
    },
    [BlockIDs.LEAVES]: {
        name: "Leaves",
        textureId: 24,
        solid: true,
    },
    [BlockIDs.GRAVEL]: {
        name: "",
        textureId: 4,
        solid: false,
    }
};