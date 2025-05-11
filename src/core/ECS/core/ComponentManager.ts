import {Component, type ComponentType} from "./Component.ts";
import {ComponentArray, type IComponentArray} from "./ComponentArray.ts";
import type {Entity} from "./Entity.ts";

export class ComponentManager {
    private componentTypes = new Map<Function, ComponentType>();
    private componentArrays = new Map<Function, IComponentArray>();
    private nextComponentType: ComponentType = 0;

    registerComponent<T>(componentClass: new (...args: any[]) => T) {
        if (this.componentTypes.has(componentClass)) return;
        this.componentTypes.set(componentClass, this.nextComponentType++);
        this.componentArrays.set(componentClass, new ComponentArray<T>());
    }

    getComponentType<T extends Component>(componentClass: new (...args: any[]) => T): ComponentType {
        const type = this.componentTypes.get(componentClass);
        if (type === undefined) throw new Error("Component not registered");
        return type;
    }

    addComponent<T>(entity: Entity, componentClass: new (...args: any[]) => T, component: T) {
        const array = this.getComponentArray<T>(componentClass);
        array.insert(entity, component);
    }

    removeComponent<T>(entity: Entity, componentClass: new () => T) {
        this.getComponentArray<T>(componentClass).remove(entity);
    }

    getComponent<T extends Component>(entity: Entity, componentClass: new (...args: any[]) => T): T {
        return this.getComponentArray<T>(componentClass).get(entity);
    }

    entityDestroyed(entity: Entity) {
        for (const array of this.componentArrays.values()) array.entityDestroyed(entity);
    }

    private getComponentArray<T>(componentClass: new () => T): ComponentArray<T> {
        return this.componentArrays.get(componentClass)! as ComponentArray<T>;
    }
}
