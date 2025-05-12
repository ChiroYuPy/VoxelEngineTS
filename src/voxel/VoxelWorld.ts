import * as THREE from 'three';
import { CHUNK_SIZE, RENDER_DIST, CHUNK_HEIGHT_BOTTOM_LIMIT, CHUNK_HEIGHT_TOP_LIMIT, VOXEL_SIZE } from '../constants.ts';
import { Vector3 } from 'three';
import { Chunk } from './chunk/Chunk.ts';
import { WorldGenerator } from './WorldGenerator.ts';
import {FlatGenerator} from "./generators/FlatGenerator.ts";
import {NaturalGenerator} from "./generators/NaturalGenerator.ts";

export class VoxelWorld {
  private chunks: Map<string, Chunk> = new Map();
  private readonly scene: THREE.Scene;
  private readonly generator: WorldGenerator;
  private readonly seed: number;
  private usePlayerPosition: boolean;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.seed = 0;
    this.generator = new NaturalGenerator(this.seed);
    this.usePlayerPosition = false;

    // this.grid = new THREE.Group();
    // this.scene.add(this.grid);
    // this.createGrid(new THREE.Vector3());
  }

  // === UTILITAIRES ===

  private chunkKey(cx: number, cy: number, cz: number): string {
    return `${cx},${cy},${cz}`;
  }

  private worldToChunkCoord(coord: number): number {
    return Math.floor(coord / CHUNK_SIZE);
  }

  private worldToLocalCoord(coord: number): number {
    return ((coord % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
  }

  getChunkAt(cx: number, cy: number, cz: number): Chunk | undefined {
    return this.chunks.get(this.chunkKey(cx, cy, cz));
  }

  // === BLOCS ===

  public getBlockAt(x: number, y: number, z: number): number {
    const cx = this.worldToChunkCoord(x);
    const cy = this.worldToChunkCoord(y);
    const cz = this.worldToChunkCoord(z);
    const chunk = this.getChunkAt(cx, cy, cz);
    if (!chunk) return 0;

    const lx = this.worldToLocalCoord(x);
    const ly = this.worldToLocalCoord(y);
    const lz = this.worldToLocalCoord(z);

    return chunk.data.getVoxel(lx, ly, lz);
  }

  public setBlockAt(x: number, y: number, z: number, id: number): void {
    const cx = this.worldToChunkCoord(x);
    const cy = this.worldToChunkCoord(y);
    const cz = this.worldToChunkCoord(z);
    const chunk = this.getChunkAt(cx, cy, cz);
    if (!chunk) return;

    const lx = this.worldToLocalCoord(x);
    const ly = this.worldToLocalCoord(y);
    const lz = this.worldToLocalCoord(z);

    chunk.data.setVoxel(lx, ly, lz, id);
    chunk.setDirty();
    this.markNeighborsDirty(cx, cy, cz);
  }

  private markNeighborsDirty(cx: number, cy: number, cz: number): void {
    const offsets = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
    ];
    for (const [dx, dy, dz] of offsets) {
      const neighbor = this.getChunkAt(cx + dx, cy + dy, cz + dz);
      if (neighbor) neighbor.setDirty();
    }
  }

  public isVoid(x: number, y: number, z: number): boolean {
      const idx: number = this.getBlockAt(x, y, z);
      return idx == 0;
  }

  public isSolid(x: number, y: number, z: number): boolean {
      return !this.isVoid(x, y, z);
  }

  // === CHUNKS ===

  private ensureChunkExists(cx: number, cy: number, cz: number): void {
    const key = this.chunkKey(cx, cy, cz);
    if (!this.chunks.has(key)) {
      const chunkPos = new Vector3(cx, cy, cz);
      const chunk = new Chunk(chunkPos, this.generator, this);
      chunk.generate();
      this.chunks.set(key, chunk);
    }
  }

  private unloadUnusedChunks(needed: Set<string>): void {
    for (const key of Array.from(this.chunks.keys())) {
      if (!needed.has(key)) {
        const chunk = this.chunks.get(key)!;
        chunk.meshes.forEach(mesh => {
          this.scene.remove(mesh);
          mesh.geometry.dispose();
          Array.isArray(mesh.material)
              ? mesh.material.forEach(mat => mat.dispose())
              : mesh.material.dispose();
        });
        this.chunks.delete(key);
      }
    }
  }

  private buildVisibleChunks(): void {
    for (const chunk of this.chunks.values()) {
      chunk.buildMesh(this.scene);
    }
  }

  public updateChunks(playerPos: THREE.Vector3): void {
    const centerX = this.usePlayerPosition
        ? Math.floor(playerPos.x / (CHUNK_SIZE * VOXEL_SIZE))
        : 0;  // Si usePlayerPosition est false, centre autour de (0, 0, 0)

    const centerZ = this.usePlayerPosition
        ? Math.floor(playerPos.z / (CHUNK_SIZE * VOXEL_SIZE))
        : 0;  // Idem pour Z

    const needed = new Set<string>();

    for (let dx = -RENDER_DIST; dx <= RENDER_DIST; dx++) {
      for (let cy = -CHUNK_HEIGHT_BOTTOM_LIMIT; cy <= CHUNK_HEIGHT_TOP_LIMIT; cy++) {
        for (let dz = -RENDER_DIST; dz <= RENDER_DIST; dz++) {
          const cx = centerX + dx;
          const cy_ = cy;
          const cz = centerZ + dz;
          const key = this.chunkKey(cx, cy_, cz);
          needed.add(key);
          this.ensureChunkExists(cx, cy_, cz);
        }
      }
    }

    this.buildVisibleChunks();
    this.unloadUnusedChunks(needed);
  }

  // === RAYCAST ===

  public raycast(origin: THREE.Vector3, direction: THREE.Vector3) {
    const pos = origin.clone();
    const step = direction.clone().normalize().multiplyScalar(0.1);

    for (let i = 0; i < 100; i++) {
      pos.add(step);
      const x = Math.floor(pos.x);
      const y = Math.floor(pos.y);
      const z = Math.floor(pos.z);

      const block = this.getBlockAt(x, y, z);
      if (block !== 0) {
        const normal = this.approximateNormal(pos, new THREE.Vector3(x, y, z));
        return {
          position: new THREE.Vector3(x, y, z),
          normal,
        };
      }
    }

    return null;
  }

  private approximateNormal(hitPos: THREE.Vector3, blockPos: THREE.Vector3): THREE.Vector3 {
    const frac = hitPos.clone().sub(blockPos.clone().addScalar(0.5));
    const max = Math.max(Math.abs(frac.x), Math.abs(frac.y), Math.abs(frac.z));
    return new THREE.Vector3(
        Math.abs(frac.x) === max ? Math.sign(frac.x) : 0,
        Math.abs(frac.y) === max ? Math.sign(frac.y) : 0,
        Math.abs(frac.z) === max ? Math.sign(frac.z) : 0,
    );
  }
}
