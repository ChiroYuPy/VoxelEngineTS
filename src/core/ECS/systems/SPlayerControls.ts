import {System} from "../generic/System.ts";
import type {ComponentManager} from "../generic/ComponentManager.ts";
import {InputHandler} from "../../../input/inputHandler.ts";
import {
    PLAYER_JUMP_STRENGTH,
    MOUSE_SENSITIVITY,
    PLAYER_SPEED,
    PLAYER_SPRINT_SPEED, PLAYER_CAMERA_HEIGHT, PLAYER_CAMERA_SNEAK_HEIGHT,
} from "../../../constants.ts";
import * as THREE from "three";
import {CPosition} from "../components/CPosition.ts";
import {COrientation} from "../components/COrientation.ts";
import {CCamera} from "../components/CCamera.ts";
import {CEntityState} from "../components/CEntityState.ts";
import {CVelocity} from "../components/CVelocity.ts";

export class SPlayerControls extends System {
    update(cm: ComponentManager, input: InputHandler, deltaTime: number) {
        for (const entity of this.entities) {
            const position: CPosition = cm.getComponent(entity, CPosition);
            const velocity: CVelocity = cm.getComponent(entity, CVelocity);
            const orientation: COrientation = cm.getComponent(entity, COrientation);
            const camera: CCamera = cm.getComponent(entity, CCamera);
            const state: CEntityState = cm.getComponent(entity, CEntityState);

            if (!position || !orientation || !camera) continue;

            state.isSprint = input.move.sprint
            state.isSneak = input.move.sneak;

            const speed = state.isSprint ? PLAYER_SPRINT_SPEED * deltaTime : PLAYER_SPEED * deltaTime;

            orientation.yaw -= input.mouse.deltaX * MOUSE_SENSITIVITY;
            orientation.pitch -= input.mouse.deltaY * MOUSE_SENSITIVITY;

            orientation.pitch = Math.max(-89, Math.min(89, orientation.pitch)); // clamp pitch

            // --- CALCUL DE LA DIRECTION
            const yawRad = THREE.MathUtils.degToRad(orientation.yaw);
            const pitchRad = THREE.MathUtils.degToRad(orientation.pitch);

            const dir = new THREE.Vector3(
                Math.sin(yawRad),
                0,
                Math.cos(yawRad)
            ).normalize();

            const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

            const delta = new THREE.Vector3(0, 0, 0);

            if (input.move.forward) delta.add(dir);
            if (input.move.back) delta.addScaledVector(dir, -1);
            if (input.move.right) delta.add(right);
            if (input.move.left) delta.addScaledVector(right, -1);
            if (input.move.jump && state.onGround) velocity.y += PLAYER_JUMP_STRENGTH;

            delta.normalize().multiplyScalar(speed);

            velocity.x += delta.x;
            velocity.z += delta.z;

            const cameraHeight = state.isSneak ? PLAYER_CAMERA_SNEAK_HEIGHT : PLAYER_CAMERA_HEIGHT;
            const cameraPos = new THREE.Vector3(position.x, position.y + cameraHeight, position.z); // position des yeux
            const lookDir = new THREE.Vector3(
                Math.cos(pitchRad) * Math.sin(yawRad),
                Math.sin(pitchRad),
                Math.cos(pitchRad) * Math.cos(yawRad)
            ).normalize();

            const target = cameraPos.clone().add(lookDir);
            camera.camera.position.copy(cameraPos);
            camera.camera.lookAt(target);
        }
    }
}