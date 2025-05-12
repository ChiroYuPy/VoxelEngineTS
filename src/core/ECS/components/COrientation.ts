import {Component} from "../generic/Component.ts";

export class COrientation extends Component {
    public yaw: number;
    public pitch: number;

    constructor(yaw: number, pitch: number) {
        super();
        this.yaw = yaw;
        this.pitch = pitch;
    }
}