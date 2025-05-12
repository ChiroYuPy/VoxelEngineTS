import {EntityManager} from "./EntityManager.ts";
import {ComponentManager} from "./ComponentManager.ts";
import {SystemManager} from "./SystemManager.ts";
import type { Entity } from "./Entity.ts";
import type {Component} from "./Component.ts";
import type {System} from "./System.ts";
import type {Signature} from "./Signature.ts";

export class ECS {
    private entityManager = new EntityManager();
    private componentManager = new ComponentManager();
    private systemManager = new SystemManager();

    createEntity(): Entity {
        return this.entityManager.createEntity();
    }

    destroyEntity(entity: Entity) {
        this.entityManager.destroyEntity(entity);
        this.componentManager.entityDestroyed(entity);
        this.systemManager.entityDestroyed(entity);
    }

    registerComponent<T extends Component>(componentClass: new (...args: any[]) => T) {
        this.componentManager.registerComponent(componentClass);
    }

    addComponent<T extends Component>(entity: Entity, componentClass: new (...args: any[]) => T, component: T) {
        this.componentManager.addComponent(entity, componentClass, component);
        const signature = this.entityManager.getSignature(entity);
        const componentType = this.componentManager.getComponentType(componentClass);
        signature[componentType] = true;
        this.entityManager.setSignature(entity, signature);
        this.systemManager.entitySignatureChanged(entity, signature);
    }

    getComponent<T extends Component>(entity: Entity, componentClass: new (...args: any[]) => T): T {
        return this.componentManager.getComponent(entity, componentClass);
    }

    registerSystem<T extends System>(
        systemClass: new (...args: any[]) => T,
        ...args: ConstructorParameters<typeof systemClass>
    ): T {
        return this.systemManager.registerSystem(systemClass, ...args);
    }

    setSystemSignature(systemClass: Function, signature: Signature) {
        this.systemManager.setSignature(systemClass, signature);
    }

    getComponentManager(): ComponentManager {
        return this.componentManager;
    }
}