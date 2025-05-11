export class InputHandler {
    move = {
        forward: false,
        back: false,
        left: false,
        right: false,
        jump: false,
        sneak: false,
    };

    constructor() {
        document.addEventListener('keydown', e => this.setMove(e.code, true));
        document.addEventListener('keyup', e => this.setMove(e.code, false));
    }

    private setMove(code: string, state: boolean) {
        switch (code) {
            case 'KeyW': this.move.forward = state; break;
            case 'KeyS': this.move.back = state; break;
            case 'KeyA': this.move.left = state; break;
            case 'KeyD': this.move.right = state; break;
            case 'Space': this.move.jump = state; break;
            case 'ShiftLeft':
            case 'ShiftRight': this.move.sneak = state; break;
        }
    }
}