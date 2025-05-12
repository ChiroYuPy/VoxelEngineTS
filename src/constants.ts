// common voxel engine constants
export const VOXEL_SIZE: number     = 1;
export const CHUNK_SIZE: number     = 16;
export const CHUNK_AREA: number     = CHUNK_SIZE * CHUNK_SIZE;
export const CHUNK_VOLUME: number   = CHUNK_AREA * CHUNK_SIZE;

// performance settings
export const RENDER_DIST: number    = 1;

// generation settings
export const CHUNK_HEIGHT_BOTTOM_LIMIT: number  = 0;
export const CHUNK_HEIGHT_TOP_LIMIT: number     = 3;
export const CHUNK_HEIGHT_SCALE: number   = (CHUNK_HEIGHT_TOP_LIMIT - CHUNK_HEIGHT_BOTTOM_LIMIT + 1) * CHUNK_SIZE;

// player settings
export const PLAYER_HEIGHT: number  = 2;
export const PLAYER_HITBOX_SIZE: number = 0.8;
export const PLAYER_SPEED: number   = 32;
export const MOUSE_SENSITIVITY: number = 0.2;

export const GRAVITY: number = 32;
export const AIR_RESISTANCE: number = 0.96;
export const JUMP_VELOCITY: number = 10;