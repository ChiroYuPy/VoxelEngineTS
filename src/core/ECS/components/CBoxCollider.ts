import {Component} from "../generic/Component.ts";

export class CBoxCollider extends Component {
    public width: number;
    public height: number;
    public depth: number;

    constructor(width: number, height: number, depth: number) {
        super();
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
}