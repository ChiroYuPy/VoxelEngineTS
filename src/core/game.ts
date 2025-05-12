import * as THREE from 'three';
import { VoxelWorld } from '../voxel/VoxelWorld.ts';
import {CHUNK_HEIGHT_SCALE, CHUNK_SIZE, PLAYER_HEIGHT, PLAYER_HITBOX_SIZE, RENDER_DIST} from '../constants.ts';
import { InputHandler } from '../input/inputHandler.ts';
import Stats from 'stats.js';
import {MAX_COMPONENTS} from "./ECS/generic/Component.ts";
import {ECS} from "./ECS/generic/ECS.ts";
import type {Signature} from "./ECS/generic/Signature.ts";
import {CPosition } from './ECS/components/CPosition.ts';
import {CVelocity } from './ECS/components/CVelocity.ts';
import {CBoxCollider} from "./ECS/components/CBoxCollider.ts";
import {CCamera} from "./ECS/components/CCamera.ts";
import {CEntityState} from "./ECS/components/CEntityState.ts";
import {SPlayerControls} from "./ECS/systems/SPlayerControls.ts";
import {SRender} from "./ECS/systems/SRender.ts";
import {CThreeObject} from "./ECS/components/CThreeObject.ts";
import {COrientation} from "./ECS/components/COrientation.ts";
import type {Entity} from "./ECS/generic/Entity.ts";
import {SPhysics} from "./ECS/systems/SPhysics.ts";

export class Game {
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private readonly input: InputHandler;
    private voxelWorld: VoxelWorld;
    private raycaster: THREE.Raycaster;
    private clock: THREE.Clock;
    private stats: Stats;
    private ecs: ECS;

    private renderSystem: SRender;
    private playerControlsSystem: SPlayerControls;
    private physicsSystem: SPhysics;

    private readonly playerEntity: Entity;

    public locked: boolean = false;

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
        this.voxelWorld = new VoxelWorld(this.scene);
        this.input = new InputHandler();

        // ECS begin //

        this.ecs = new ECS();

        this.ecs.registerComponent(CPosition);
        this.ecs.registerComponent(COrientation);
        this.ecs.registerComponent(CVelocity);
        this.ecs.registerComponent(CCamera);
        this.ecs.registerComponent(CEntityState);
        this.ecs.registerComponent(CThreeObject);
        this.ecs.registerComponent(CBoxCollider);

        this.renderSystem = this.ecs.registerSystem(SRender);
        const renderSystemSig: Signature = Array(MAX_COMPONENTS).fill(false);
        renderSystemSig[this.ecs.getComponentManager().getComponentType(CPosition)] = true;
        renderSystemSig[this.ecs.getComponentManager().getComponentType(CThreeObject)] = true;
        this.ecs.setSystemSignature(SRender, renderSystemSig);

        this.playerControlsSystem = this.ecs.registerSystem(SPlayerControls, this.input);
        const playerControlSystemSig: Signature = Array(MAX_COMPONENTS).fill(false);
        playerControlSystemSig[this.ecs.getComponentManager().getComponentType(CPosition)] = true;
        playerControlSystemSig[this.ecs.getComponentManager().getComponentType(CVelocity)] = true;
        playerControlSystemSig[this.ecs.getComponentManager().getComponentType(COrientation)] = true;
        playerControlSystemSig[this.ecs.getComponentManager().getComponentType(CCamera)] = true;
        playerControlSystemSig[this.ecs.getComponentManager().getComponentType(CEntityState)] = true;
        this.ecs.setSystemSignature(SPlayerControls, playerControlSystemSig);

        this.physicsSystem = this.ecs.registerSystem(SPhysics);
        const physicsSystemSig: Signature = Array(MAX_COMPONENTS).fill(false);
        physicsSystemSig[this.ecs.getComponentManager().getComponentType(CPosition)] = true;
        physicsSystemSig[this.ecs.getComponentManager().getComponentType(CVelocity)] = true;
        physicsSystemSig[this.ecs.getComponentManager().getComponentType(CEntityState)] = true;
        physicsSystemSig[this.ecs.getComponentManager().getComponentType(CBoxCollider)] = true;
        this.ecs.setSystemSignature(SPhysics, physicsSystemSig);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const count = 53;
        const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
        this.scene.add(instancedMesh);

        for (let i = 0; i < count; i++) {
            const x = (i % 4) * 1.2;
            const y = Math.floor(i / 4) % 4 * 1.2 + 48;
            const z = Math.floor(i / 16) * 1.2;

            const entity = this.ecs.createEntity();
            this.ecs.addComponent(entity, CPosition, new CPosition(x, y, z));
            this.ecs.addComponent(entity, CVelocity, new CVelocity());
            this.ecs.addComponent(entity, CThreeObject, new CThreeObject(instancedMesh, i));
            this.ecs.addComponent(entity, CBoxCollider, new CBoxCollider(1, 1, 1));
            this.ecs.addComponent(entity, CEntityState, new CEntityState());
        }

        this.playerEntity = this.ecs.createEntity();

        this.ecs.addComponent(this.playerEntity, CPosition, new CPosition(0, CHUNK_HEIGHT_SCALE + PLAYER_HEIGHT, 0));
        this.ecs.addComponent(this.playerEntity, CVelocity, new CVelocity());
        this.ecs.addComponent(this.playerEntity, COrientation, new COrientation(0, 0));
        this.ecs.addComponent(this.playerEntity, CEntityState, new CEntityState());
        this.ecs.addComponent(this.playerEntity, CCamera, new CCamera(this.camera, "firstPerson"));
        this.ecs.addComponent(this.playerEntity, CBoxCollider, new CBoxCollider(PLAYER_HITBOX_SIZE, PLAYER_HEIGHT, PLAYER_HITBOX_SIZE));

        // ECS end //

        this.initEvents();
        this.animate();

        this.setupPointerLock();

        const pos = this.ecs.getComponent(this.playerEntity, CPosition);
        this.voxelWorld.updateChunks(new THREE.Vector3(pos.x, pos.y, pos.z));
    }

    private setupPointerLock() {
        const blocker = document.getElementById('blocker')!;
        const canvas = this.renderer.domElement;

        blocker.addEventListener('click', () => {
            canvas.requestPointerLock();
        });

        const onPointerLockChange = () => {
            if (document.pointerLockElement === canvas) {
                blocker.style.display = 'none';
                this.locked = true;
            } else {
                blocker.style.display = 'flex';
                this.locked = false;
            }
        };

        document.addEventListener('pointerlockchange', onPointerLockChange, false);
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
            if (!this.locked) return;

            this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
            const origin = this.raycaster.ray.origin.clone();
            const direction = this.raycaster.ray.direction.clone();

            const hit = this.voxelWorld.raycast(origin, direction);
            if (hit) {
                const { position, normal } = hit;
                if (event.button === 0) {
                    const placePos = position.clone().add(normal);
                    this.voxelWorld.setBlockAt(
                        Math.floor(placePos.x),
                        Math.floor(placePos.y),
                        Math.floor(placePos.z),
                        1
                    );
                } else if (event.button === 2) {
                    this.voxelWorld.setBlockAt(position.x, position.y, position.z, 0);
                }
            }
        });
    }

    private animate = () => {
        requestAnimationFrame(this.animate);

        this.stats.begin();

        const dt = this.clock.getDelta();

        if (this.locked) {
            this.playerControlsSystem.update(this.ecs.getComponentManager(), this.input, dt);

            const pos = this.ecs.getComponent(this.playerEntity, CPosition);
            this.voxelWorld.updateChunks(new THREE.Vector3(pos.x, pos.y, pos.z));

            this.renderSystem.update(this.ecs.getComponentManager());

            this.physicsSystem.update(this.ecs.getComponentManager(), this.voxelWorld, dt);

        }

        this.renderer.render(this.scene, this.camera);

        this.input.update();

        this.stats.end();
    };
}
