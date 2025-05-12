import { System } from "../generic/System.ts";
import type { ComponentManager } from "../generic/ComponentManager.ts";
import { CPosition } from "../components/CPosition.ts";
import { CVelocity } from "../components/CVelocity.ts";
import { CEntityState } from "../components/CEntityState.ts";
import { AIR_RESISTANCE, GRAVITY } from "../../../constants.ts";
import { CBoxCollider } from "../components/CBoxCollider.ts";
import type { VoxelWorld } from "../../../voxel/VoxelWorld.ts";

export class SPhysics extends System {
    update(cm: ComponentManager, world: VoxelWorld, deltaTime: number) {
        let i = 0;
        for (const entity of this.entities) {
            i++;
            const pos = cm.getComponent(entity, CPosition);
            const vel = cm.getComponent(entity, CVelocity);
            const state = cm.getComponent(entity, CEntityState);
            const collider = cm.getComponent(entity, CBoxCollider);

            if (!state.onGround) {
                vel.y -= GRAVITY * deltaTime;
            }

            this.moveWithCollision(pos, vel, collider, world, deltaTime, state);

            if (!state.onGround) {
                vel.x *= AIR_RESISTANCE;
                vel.z *= AIR_RESISTANCE;
            }
        }
    }

    private moveWithCollision(
        pos: CPosition,
        vel: CVelocity,
        collider: CBoxCollider,
        world: VoxelWorld,
        delta: number,
        state: CEntityState
    ) {
        state.onGround = false;


        pos.x += vel.x * delta;
        if (this.collides(pos, collider, world)) {
            pos.x -= vel.x * delta;
            vel.x = 0;
        }

        pos.y += vel.y * delta;
        if (this.collides(pos, collider, world)) {
            pos.y -= vel.y * delta;
            if (vel.y < 0) {
                state.onGround = true;
                vel.y = 0;
            }
        }

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
                    if (world.isSolid(x, y, z)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
