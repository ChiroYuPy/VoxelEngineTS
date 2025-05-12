import {type Entity, MAX_ENTITIES} from "./Entity.ts";
import type {Signature} from "./Signature.ts";
import {MAX_COMPONENTS} from "./Component.ts";

export class EntityManager {
    private availableEntities: Entity[] = [];
    private signatures: Signature[] = Array.from({ length: MAX_ENTITIES }, () => Array(MAX_COMPONENTS).fill(false));
    private livingEntityCount = 0;

    constructor() {
        for (let i = 0; i < MAX_ENTITIES; i++) this.availableEntities.push(i);
    }

    createEntity(): Entity {
        if (this.livingEntityCount >= MAX_ENTITIES) throw new Error("Too many entities");
        const id = this.availableEntities.pop()!;
        this.livingEntityCount++;
        return id;
    }

    destroyEntity(entity: Entity): void {
        this.signatures[entity] = Array(MAX_COMPONENTS).fill(false);
        this.availableEntities.push(entity);
        this.livingEntityCount--;
    }

    setSignature(entity: Entity, signature: Signature) {
        this.signatures[entity] = signature;
    }

    getSignature(entity: Entity): Signature {
        return this.signatures[entity];
    }
}