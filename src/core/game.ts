import * as THREE from 'three';
import { VoxelWorld } from '../voxel/VoxelWorld.ts';
import {CHUNK_HEIGHT_SCALE, CHUNK_SIZE, PLAYER_HEIGHT, PLAYER_SPEED, RENDER_DIST} from '../constants.ts';
import { InputHandler } from '../input/inputHandler.ts';
import Stats from 'stats.js';
import {Component, MAX_COMPONENTS} from "./ECS/core/Component.ts";
import {Object3D} from "three";
import {System} from "./ECS/core/System.ts";
import type {ComponentManager} from "./ECS/core/ComponentManager.ts";
import {ECS} from "./ECS/core/ECS.ts";
import type {Signature} from "./ECS/core/Signature.ts";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

class blockerControls {
    private controls: PointerLockControls;

    constructor(camera: THREE.Camera, domElement: HTMLElement) {
        const blocker = document.getElementById('blocker')!;
        this.controls = new PointerLockControls(camera, domElement);
        blocker.addEventListener('click', () => this.controls.lock());
        this.controls.addEventListener('lock', () => blocker.style.display = 'none');
        this.controls.addEventListener('unlock', () => blocker.style.display = 'flex');
        camera.parent?.add(this.controls.object);
    }

    isLocked(): boolean {
        return this.controls.isLocked;
    }

    getPosition(): THREE.Vector3 {
        return this.controls.object.position;
    }
}


class PositionComponent extends Component {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class VelocityComponent extends Component {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class BallColliderComponent extends Component {
    public height: number;
    public radius: number;
    constructor(height: number, radius: number) {
        super();
        this.height = height;
        this.radius = radius;
    }
}

const CameraMode = {
    THIRD_PERSON: "thirdPerson",
    FIRST_PERSON: "firstPerson"
};

export type CameraMode = typeof CameraMode[keyof typeof CameraMode];

class CameraComponent extends Component {
    public camera: THREE.PerspectiveCamera;
    public cameraMode: CameraMode;
    constructor(camera: THREE.PerspectiveCamera, cameraMode: CameraMode) {
        super();
        this.camera = camera;
        this.cameraMode = cameraMode;
    }
}

class PlayerStateComponent extends Component {
    public onGround: boolean;
    public jumpHeight: number;
    public moveSpeed: number;
    constructor(onGround: boolean, jumpHeight: number, moveSpeed: number) {
        super();
        this.onGround = onGround;
        this.jumpHeight = jumpHeight;
        this.moveSpeed = moveSpeed;
    }
}

class ThreeObject extends Component {
    public object: Object3D;

    constructor(object: THREE.Object3D) {
        super();
        this.object = object;
    }
}

class InstanceIndex extends Component {
    index: number;

    constructor(index: number) {
        super();
        this.index = index;
    }
}

class PlayerControlsComponent extends Component {
    public controls: PointerLockControls;

    constructor(camera: THREE.Camera, domElement: HTMLElement) {
        super();
        const blocker = document.getElementById('blocker')!;
        this.controls = new PointerLockControls(camera, domElement);
        blocker.addEventListener('click', () => this.controls.lock());
        this.controls.addEventListener('lock', () => blocker.style.display = 'none');
        this.controls.addEventListener('unlock', () => blocker.style.display = 'flex');
        camera.parent?.add(this.controls.object);
    }

    isLocked(): boolean {
        return this.controls.isLocked;
    }

    getPosition(): THREE.Vector3 {
        return this.controls.object.position;
    }
}

class PlayerControlSystem extends System {
    update(cm: ComponentManager, input: InputHandler, deltaTime: number) {
        for (const entity of this.entities) {
            const playerControls = cm.getComponent(entity, PlayerControlsComponent);
            const position = cm.getComponent(entity, PositionComponent);
            const collider = cm.getComponent(entity, BallColliderComponent);

            if (!playerControls || !position || !collider) continue;

            const speed = PLAYER_SPEED * deltaTime;
            const object = playerControls.controls.object;

            const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(object.quaternion).setY(0).normalize();
            const right = new THREE.Vector3().crossVectors(dir, object.up).normalize();

            if (input.move.forward) object.position.addScaledVector(dir, speed);
            if (input.move.back) object.position.addScaledVector(dir, -speed);
            if (input.move.left) object.position.addScaledVector(right, -speed);
            if (input.move.right) object.position.addScaledVector(right, speed);
            if (input.move.jump) object.position.y += speed;
            if (input.move.sneak) object.position.y -= speed;

            // Gestion de la position en Y pour éviter de traverser le sol
            const minY: number = 0;
            if (object.position.y < minY + collider.height / 2) {
                object.position.y = collider.height / 2;
            }

            // Mise à jour de la position de l'entité
            position.x = object.position.x;
            position.y = object.position.y;
            position.z = object.position.z;
        }
    }
}

class RenderSystem extends System {
    update(cm: ComponentManager) {
        for (const entity of this.entities) {
            const position = cm.getComponent(entity, PositionComponent);
            const threeObj = cm.getComponent(entity, ThreeObject);
            threeObj.object.position.set(position.x, position.y, 0);
        }
    }
}

class InstancedRenderSystem extends System {
    update(cm: ComponentManager) {
        let sharedMesh: THREE.InstancedMesh | null = null;

        for (const entity of this.entities) {
            const position = cm.getComponent(entity, PositionComponent);
            const index = cm.getComponent(entity, InstanceIndex).index;
            const mesh = cm.getComponent(entity, ThreeObject).object as THREE.InstancedMesh;

            if (!sharedMesh) sharedMesh = mesh;

            const dummy = new THREE.Object3D();
            dummy.position.set(position.x, position.y, 0);
            dummy.updateMatrix();
            mesh.setMatrixAt(index, dummy.matrix);
        }

        if (sharedMesh) sharedMesh.instanceMatrix.needsUpdate = true;
    }
}

export class Game {
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private blockerControls: blockerControls;
    private readonly input: InputHandler;
    private world: VoxelWorld;
    private raycaster: THREE.Raycaster;
    private clock: THREE.Clock;
    private stats: Stats;
    private ecs: ECS;
    private renderSystem: InstancedRenderSystem;
    private playerControlSystem: PlayerControlSystem;

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, CHUNK_HEIGHT_SCALE + PLAYER_HEIGHT, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        this.initLights();
        this.initGrid();
        this.world = new VoxelWorld(this.scene);
        this.blockerControls = new blockerControls(this.camera, document.body);
        this.input = new InputHandler();

        // ECS begin //

        this.ecs = new ECS();

        this.ecs.registerComponent(PositionComponent);
        this.ecs.registerComponent(VelocityComponent);
        this.ecs.registerComponent(CameraComponent);
        this.ecs.registerComponent(PlayerStateComponent);
        this.ecs.registerComponent(ThreeObject);
        this.ecs.registerComponent(InstanceIndex);
        this.ecs.registerComponent(PlayerControlsComponent);
        this.ecs.registerComponent(BallColliderComponent);

        this.renderSystem = this.ecs.registerSystem(InstancedRenderSystem);
        const renderSystemSig: Signature = Array(MAX_COMPONENTS).fill(false);
        renderSystemSig[this.ecs.getComponentManager().getComponentType(PositionComponent)] = true;
        renderSystemSig[this.ecs.getComponentManager().getComponentType(ThreeObject)] = true;
        renderSystemSig[this.ecs.getComponentManager().getComponentType(InstanceIndex)] = true;
        this.ecs.setSystemSignature(InstancedRenderSystem, renderSystemSig);

        this.playerControlSystem = this.ecs.registerSystem(PlayerControlSystem, this.input);
        const playerControlSystemSig: Signature = Array(MAX_COMPONENTS).fill(false);
        playerControlSystemSig[this.ecs.getComponentManager().getComponentType(PlayerControlsComponent)] = true;
        playerControlSystemSig[this.ecs.getComponentManager().getComponentType(PositionComponent)] = true;
        this.ecs.setSystemSignature(PlayerControlSystem, playerControlSystemSig);

        // Création du mesh instancié
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const count = 32;
        const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
        this.scene.add(instancedMesh);

        // Création de 32 entités ECS instanciées
        for (let i = 0; i < count; i++) {
            const x = (i % 8) * 2;
            const y = Math.floor(i / 8) * 2;
            const z = 0;

            const entity = this.ecs.createEntity();
            this.ecs.addComponent(entity, PositionComponent, new PositionComponent(x, y, z));
            this.ecs.addComponent(entity, InstanceIndex, new InstanceIndex(i));
            this.ecs.addComponent(entity, ThreeObject, new ThreeObject(instancedMesh));
        }

        // Créer l'entité du joueur
        const playerEntity = this.ecs.createEntity();

        // Ajouter le composant de position et de contrôles du joueur
        this.ecs.addComponent(playerEntity, PositionComponent, new PositionComponent(0, CHUNK_HEIGHT_SCALE + PLAYER_HEIGHT, 0));
        this.ecs.addComponent(playerEntity, PlayerControlsComponent, new PlayerControlsComponent(this.camera, document.body));
        this.ecs.addComponent(playerEntity, BallColliderComponent, new BallColliderComponent(PLAYER_HEIGHT, 2));

        // ECS end //

        this.initEvents();
        this.animate();
    }

    private initLights() {
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(50, 100, 50);
        dirLight.castShadow = true;
        this.scene.add(dirLight);
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    }

    private initGrid() {
        const size = CHUNK_SIZE * RENDER_DIST * 2;
        const divisions = size / CHUNK_SIZE;
        const gridHelper = new THREE.GridHelper(size, divisions, 0x0000ff, 0x808080);
        this.scene.add(gridHelper);
    }

    private initEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('mousedown', (event) => {
            if (!this.blockerControls.isLocked()) return;

            this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
            const origin = this.raycaster.ray.origin.clone();
            const direction = this.raycaster.ray.direction.clone();

            const hit = this.world.raycast(origin, direction);
            if (hit) {
                const { position, normal } = hit;
                if (event.button === 0) {
                    const placePos = position.clone().add(normal);
                    this.world.setBlockAt(
                        Math.floor(placePos.x),
                        Math.floor(placePos.y),
                        Math.floor(placePos.z),
                        1
                    );
                } else if (event.button === 2) {
                    this.world.setBlockAt(position.x, position.y, position.z, 0);
                }
            }
        });
    }

    private animate = () => {
        requestAnimationFrame(this.animate);

        this.stats.begin();

        if (this.blockerControls.isLocked()) {
            const dt = this.clock.getDelta();
            this.world.updateChunks(this.blockerControls.getPosition());
            this.playerControlSystem.update(this.ecs.getComponentManager(), this.input, dt);
        }

        this.renderSystem.update(this.ecs.getComponentManager());

        this.renderer.render(this.scene, this.camera);

        this.stats.end();
    };
}
