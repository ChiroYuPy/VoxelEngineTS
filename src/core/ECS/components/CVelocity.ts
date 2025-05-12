import {Component} from "../generic/Component.ts";

export class CVelocity extends Component {
    public x: number;
    public y: number;
    public z: number;

    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}