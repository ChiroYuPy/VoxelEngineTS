// common voxel engine constants
export const VOXEL_SIZE: number     = 1;
export const CHUNK_SIZE: number     = 16;
export const CHUNK_AREA: number     = CHUNK_SIZE * CHUNK_SIZE;
export const CHUNK_VOLUME: number   = CHUNK_AREA * CHUNK_SIZE;

// chunk generation settings
export const RENDER_DIST: number    = 8;
export const CHUNK_HEIGHT_BOTTOM_LIMIT: number  = 0;
export const CHUNK_HEIGHT_TOP_LIMIT: number     = 3;
export const CHUNK_HEIGHT_SCALE: number   = (CHUNK_HEIGHT_TOP_LIMIT - CHUNK_HEIGHT_BOTTOM_LIMIT + 1) * CHUNK_SIZE;

// player settings
export const PLAYER_HITBOX_SIZE: number = 0.9;
export const PLAYER_HEIGHT: number  = PLAYER_HITBOX_SIZE * 2;
export const PLAYER_CAMERA_HEIGHT: number = PLAYER_HITBOX_SIZE * 1.5;
export const PLAYER_CAMERA_SNEAK_HEIGHT: number = PLAYER_HITBOX_SIZE * 1.2;
export const PLAYER_SPEED: number   = 24;
export const PLAYER_SPRINT_SPEED: number = 48;
export const PLAYER_JUMP_STRENGTH: number = 10;

// controls settings
export const MOUSE_SENSITIVITY: number = 0.2;

// physics settings
export const GRAVITY = 30;
export const AIR_RESISTANCE = 0.98;
export const GROUND_FRICTION = 0.98;