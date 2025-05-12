import {Component} from "../generic/Component.ts";

export class CPosition extends Component {
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