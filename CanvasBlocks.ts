class BlockState {
    public scale : number = 0;
    private dir : number = 0;
    private prevScale : number = 0;
    update(stopcb : Function) {
        this.scale += 0.1 * this.dir;
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
        }
    }
    startUpdating(startcb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.scale
            startcb()
        }
    }
}
class BlocksAnimator {
    private animated : boolean = false;
    private interval : number;
    start(updatecb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class BlocksStateContainer {
    private j : number = 0
    private dir : number = 1
    constructor(private n : number) {

    }
    incrementCounter() {
        this.j += this.dir
        if (this.j == this.n || this.j == -1) {
            this.dir *= -1
            this.j += this.dir
        }
    }
    executeCB(cb : Function) {
        cb(this.j)
    }
}
