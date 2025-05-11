import type {System} from "./System.ts";
import type {Signature} from "./Signature.ts";
import type {Entity} from "./Entity.ts";
export class SystemManager {
    private systems = new Map<Function, System>();
    private signatures = new Map<Function, Signature>();

    registerSystem<T extends System>(SystemType: new (...args: any[]) => T, ...args: any[]): T {
        const system = new SystemType(...args);
        this.systems.set(SystemType, system);
        return system;
    }

    setSignature(systemClass: Function, signature: Signature) {
        this.signatures.set(systemClass, signature);
    }

    entityDestroyed(entity: Entity) {
        for (const system of this.systems.values()) {
            system.entities.delete(entity);
        }
    }

    entitySignatureChanged(entity: Entity, entitySignature: Signature) {
        for (const [systemClass, system] of this.systems) {
            const systemSignature = this.signatures.get(systemClass)!;
            const match = systemSignature.every((val, i) => !val || entitySignature[i]);
            if (match) system.entities.add(entity);
            else system.entities.delete(entity);
        }
    }
}