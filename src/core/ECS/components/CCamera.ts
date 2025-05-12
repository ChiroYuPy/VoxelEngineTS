import {Component} from "../generic/Component.ts";
import * as THREE from "three";

const CameraMode = {
    THIRD_PERSON: "thirdPerson",
    FIRST_PERSON: "firstPerson"
};

export type CameraMode = typeof CameraMode[keyof typeof CameraMode];

export class CCamera extends Component {
    public camera: THREE.PerspectiveCamera;
    public cameraMode: CameraMode;
    constructor(camera: THREE.PerspectiveCamera, cameraMode: CameraMode) {
        super();
        this.camera = camera;
        this.cameraMode = cameraMode;
    }
}