import type {Entity} from "./Entity.ts";

export abstract class System {
    entities: Set<Entity> = new Set();
}