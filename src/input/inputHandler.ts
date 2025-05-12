export class InputHandler {
    move = {
        forward: false,
        back: false,
        left: false,
        right: false,
        jump: false,
        sneak: false,
    };
    mouse = {
        left: false,
        middle: false,
        right: false,
        deltaX: 0,
        deltaY: 0,
    }

    constructor() {
        document.addEventListener('keydown', e => this.setMove(e.code, true));
        document.addEventListener('keyup', e => this.setMove(e.code, false));

        document.addEventListener('mousedown', e => this.setMouseButton(e.button, true));
        document.addEventListener('mouseup', e => this.setMouseButton(e.button, false));

        document.addEventListener('mousemove', e => {
            this.mouse.deltaX += e.movementX;
            this.mouse.deltaY += e.movementY;
        });
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

    private setMouseButton(button: number, state: boolean) {
        if (button === 0) this.mouse.left = state;
        if (button === 1) this.mouse.middle = state;
        if (button === 2) this.mouse.right = state;
    }

    update() {
        this.mouse.deltaX = 0;
        this.mouse.deltaY = 0;
    }
}