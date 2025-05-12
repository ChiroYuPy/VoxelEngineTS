import {Component} from "../generic/Component.ts";

export class CPlayerState extends Component {
    public onGround: boolean;
    public sprint: boolean;

    constructor(onGround: boolean, sprint: boolean) {
        super();
        this.onGround = onGround;
        this.sprint = sprint;
    }
}