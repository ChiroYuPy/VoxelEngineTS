import { System } from "../generic/System.ts";
import type { ComponentManager } from "../generic/ComponentManager.ts";
import { CPosition } from "../components/CPosition.ts";
import { CVelocity } from "../components/CVelocity.ts";
import { CEntityState } from "../components/CEntityState.ts";
import { AIR_RESISTANCE, GRAVITY, GROUND_FRICTION } from "../../../constants.ts";
import { CBoxCollider } from "../components/CBoxCollider.ts";
import type { VoxelWorld } from "../../../voxel/VoxelWorld.ts";

export class SPhysics extends System {
    update(cm: ComponentManager, world: VoxelWorld, deltaTime: number) {
        for (const entity of this.entities) {
            const position = cm.getComponent(entity, CPosition);
            const velocity = cm.getComponent(entity, CVelocity);
            const state = cm.getComponent(entity, CEntityState);
            const collider = cm.getComponent(entity, CBoxCollider);

            if (!state.onGround) {
                velocity.y -= GRAVITY * deltaTime;
            }

            if (state.onGround) {
                velocity.x *= GROUND_FRICTION;
                velocity.z *= GROUND_FRICTION;

            } else {
                velocity.x *= AIR_RESISTANCE;
                velocity.z *= AIR_RESISTANCE;
            }

            this.moveWithCollision(position, velocity, collider, world, deltaTime, state);
        }
    }

    private moveWithCollision(
        pos: CPosition,
        vel: CVelocity,
        collider: CBoxCollider,
        world: VoxelWorld,
        delta: number,
        state: CEntityState
    ): void {
        state.onGround = false;

        // Axe X
        pos.x += vel.x * delta;
        if (this.collides(pos, collider, world)) {
            pos.x -= vel.x * delta;
            vel.x = 0;
        }

        // Axe Y
        pos.y += vel.y * delta;
        if (this.collides(pos, collider, world)) {
            pos.y -= vel.y * delta;
            if (vel.y < 0) state.onGround = true;
            vel.y = 0;
        }

        // Axe Z
        pos.z += vel.z * delta;
        if (this.collides(pos, collider, world)) {
            pos.z -= vel.z * delta;
            vel.z = 0;
        }
    }

    private collides(
        pos: CPosition,
        collider: CBoxCollider,
        world: VoxelWorld
    ): boolean {
        const minX = Math.floor(pos.x - collider.width / 2);
        const maxX = Math.floor(pos.x + collider.width / 2);
        const minY = Math.floor(pos.y);
        const maxY = Math.floor(pos.y + collider.height);
        const minZ = Math.floor(pos.z - collider.depth / 2);
        const maxZ = Math.floor(pos.z + collider.depth / 2);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    if (world.isSolid(x, y, z)) return true;
                }
            }
        }

        return false;
    }
}
