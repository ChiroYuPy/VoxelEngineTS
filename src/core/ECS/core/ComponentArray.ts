import {type Entity, MAX_ENTITIES} from "./Entity.ts";

export interface IComponentArray {
    entityDestroyed(entity: Entity): void;
}

export class ComponentArray<T> implements IComponentArray {
    private components: T[] = new Array(MAX_ENTITIES);
    private entityToIndex = new Map<Entity, number>();
    private indexToEntity = new Map<number, Entity>();
    private size = 0;

    insert(entity: Entity, component: T) {
        if (this.entityToIndex.has(entity)) throw new Error("Entity already has component");
        const index = this.size++;
        this.entityToIndex.set(entity, index);
        this.indexToEntity.set(index, entity);
        this.components[index] = component;
    }

    remove(entity: Entity) {
        const indexToRemove = this.entityToIndex.get(entity);
        if (indexToRemove === undefined) return;

        const lastIndex = this.size - 1;
        this.components[indexToRemove] = this.components[lastIndex];

        const lastEntity = this.indexToEntity.get(lastIndex)!;
        this.entityToIndex.set(lastEntity, indexToRemove);
        this.indexToEntity.set(indexToRemove, lastEntity);

        this.entityToIndex.delete(entity);
        this.indexToEntity.delete(lastIndex);
        this.size--;
    }

    get(entity: Entity): T {
        const index = this.entityToIndex.get(entity);
        if (index === undefined) throw new Error("No such component");
        return this.components[index];
    }

    entityDestroyed(entity: Entity): void {
        if (this.entityToIndex.has(entity)) this.remove(entity);
    }
}