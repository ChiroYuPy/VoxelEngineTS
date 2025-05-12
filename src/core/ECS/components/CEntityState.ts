import {Component} from "../generic/Component.ts";

export class CEntityState extends Component {
    public onGround: boolean;
    public isSprint: boolean;
    public falDistance: number;

    constructor() {
        super();
        this.onGround = false;
        this.isSprint = false;
        this.falDistance = 0;
    }
}