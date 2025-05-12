import {System} from "../generic/System.ts";
import type {ComponentManager} from "../generic/ComponentManager.ts";
import * as THREE from "three";
import {CPosition} from "../components/CPosition.ts";
import {CThreeObject} from "../components/CThreeObject.ts";

export class SRender extends System {
    update(cm: ComponentManager) {
        let sharedMesh: THREE.InstancedMesh | null = null;

        for (const entity of this.entities) {
            const position = cm.getComponent(entity, CPosition);
            const obj = cm.getComponent(entity, CThreeObject);
            const index = obj.index;
            const mesh = obj.object as THREE.InstancedMesh;

            if (!sharedMesh) sharedMesh = mesh;

            const dummy = new THREE.Object3D();
            dummy.position.set(position.x, position.y, position.z);
            dummy.updateMatrix();
            mesh.setMatrixAt(index, dummy.matrix);
        }

        if (sharedMesh) sharedMesh.instanceMatrix.needsUpdate = true;
    }
}