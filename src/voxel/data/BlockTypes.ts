import * as THREE from "three";

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
} as const;

export type BlockID = typeof BlockIDs[keyof typeof BlockIDs];

export type BlockData = {
    name: string;
    texture: string | null;
    solid: boolean;
    color: THREE.Color | null;
};

export function getColor(id: BlockID): THREE.Color | null {
    const blockData = BlockTypes[id];
    return blockData ? blockData.color : null;
}

export const BlockTypes: { [key in BlockID]: BlockData } = {
    [BlockIDs.AIR]: {
        name: "Air",
        texture: null,
        solid: false,
        color: null,
    },
    [BlockIDs.GRASS]: {
        name: "Grass",
        texture: "grass",
        solid: true,
        color: new THREE.Color(0x00ff00),
    },
    [BlockIDs.DIRT]: {
        name: "Dirt",
        texture: "dirt",
        solid: true,
        color: new THREE.Color(0x8B4513),
    },
    [BlockIDs.STONE]: {
        name: "Stone",
        texture: "stone",
        solid: true,
        color: new THREE.Color(0xaaaaaa),
    },
    [BlockIDs.SAND]: {
        name: "Sand",
        texture: "sand",
        solid: true,
        color: new THREE.Color(0xFFFF66),
    },
    [BlockIDs.OAK_WOOD]: {
        name: "Oak Wood",
        texture: "oak_wood",
        solid: true,
        color: new THREE.Color(0xA0522D),
    },
    [BlockIDs.OAK_LEAVES]: {
        name: "Oak Leaves",
        texture: "oak_leaves",
        solid: true,
        color: new THREE.Color(0x228B22),
    },
    [BlockIDs.WATER]: {
        name: "Water",
        texture: "water",
        solid: false,
        color: new THREE.Color(0x00BFFF),
    },
    [BlockIDs.LAVA]: {
        name: "Lava",
        texture: "lava",
        solid: false,
        color: new THREE.Color(0xFF4500),
    },
    [BlockIDs.COAL_ORE]: {
        name: "Coal Ore",
        texture: "coal_ore",
        solid: true,
        color: new THREE.Color(0x1C1C1C),
    },
    [BlockIDs.IRON_ORE]: {
        name: "Iron Ore",
        texture: "iron_ore",
        solid: true,
        color: new THREE.Color(0xB0C4DE),
    },
    [BlockIDs.GOLD_ORE]: {
        name: "Gold Ore",
        texture: "gold_ore",
        solid: true,
        color: new THREE.Color(0xFFD700),
    },
    [BlockIDs.DIAMOND_ORE]: {
        name: "Diamond Ore",
        texture: "diamond_ore",
        solid: true,
        color: new THREE.Color(0x00FFFF),
    },
    [BlockIDs.LAPIS_ORE]: {
        name: "Lapis Ore",
        texture: "lapis_ore",
        solid: true,
        color: new THREE.Color(0x0000FF),
    },
    [BlockIDs.COPPER_ORE]: {
        name: "Copper Ore",
        texture: "copper_ore",
        solid: true,
        color: new THREE.Color(0xB87333),
    },
    [BlockIDs.SNOW]: {
        name: "Snow",
        texture: "snow",
        solid: true,
        color: new THREE.Color(0xFFFFFF),
    },
    [BlockIDs.FURNACE]: {
        name: "Furnace",
        texture: "furnace",
        solid: true,
        color: new THREE.Color(0x8B8B8B),
    },
    [BlockIDs.WOOD_PLANKS]: {
        name: "Wood Planks",
        texture: "wood_planks",
        solid: true,
        color: new THREE.Color(0xDEB887),
    },
    [BlockIDs.STONE_BRICKS]: {
        name: "Stone Bricks",
        texture: "stone_bricks",
        solid: true,
        color: new THREE.Color(0x8B8B8B),
    },
    [BlockIDs.TNT]: {
        name: "TNT",
        texture: "tnt",
        solid: true,
        color: new THREE.Color(0xFF0000),
    },
    [BlockIDs.FLOWER]: {
        name: "Flower",
        texture: "flower",
        solid: true,
        color: new THREE.Color(0xFF69B4),
    },
    [BlockIDs.BUSH]: {
        name: "Bush",
        texture: "bush",
        solid: true,
        color: new THREE.Color(0x228B22),
    },
    [BlockIDs.CACTUS]: {
        name: "Cactus",
        texture: "cactus",
        solid: true,
        color: new THREE.Color(0x32CD32),
    },
    [BlockIDs.ICE]: {
        name: "Ice",
        texture: "ice",
        solid: true,
        color: new THREE.Color(0xADD8E6),
    },
    [BlockIDs.BRICK]: {
        name: "Brick",
        texture: "brick",
        solid: true,
        color: new THREE.Color(0xB22222),
    },
    [BlockIDs.LEAVES]: {
        name: "Leaves",
        texture: "leaves",
        solid: true,
        color: new THREE.Color(0x228B22),
    },
};