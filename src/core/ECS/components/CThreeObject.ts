import {Component} from "../generic/Component.ts";
import {Object3D} from "three";
import * as THREE from "three";

export class CThreeObject extends Component {
    public object: Object3D;
    public index: number;

    constructor(object: THREE.Object3D, index: number) {
        super();
        this.object = object;
        this.index = index;
    }
}