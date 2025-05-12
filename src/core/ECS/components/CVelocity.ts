import {Component} from "../generic/Component.ts";

export class CVelocity extends Component {
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