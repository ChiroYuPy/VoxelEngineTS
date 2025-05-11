// common voxel engine constants
export const VOXEL_SIZE: number     = 1;
export const CHUNK_SIZE: number     = 16;
export const CHUNK_AREA: number     = CHUNK_SIZE * CHUNK_SIZE;
export const CHUNK_VOLUME: number   = CHUNK_AREA * CHUNK_SIZE;

// performance settings
export const RENDER_DIST: number    = 8;

// generation settings
export const CHUNK_HEIGHT_BOTTOM_LIMIT: number  = 0;
export const CHUNK_HEIGHT_TOP_LIMIT: number     = 1;
export const CHUNK_HEIGHT_SCALE: number   = (CHUNK_HEIGHT_TOP_LIMIT - CHUNK_HEIGHT_BOTTOM_LIMIT) * CHUNK_SIZE;

// player settings
export const PLAYER_HEIGHT: number  = 2;
export const PLAYER_SPEED: number   = 64;
