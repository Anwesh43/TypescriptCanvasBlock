const colors : string[] = ["#673AB7", "#009688", "#f44336", "#FF5722","#ef5350", "#1E88E5"];
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
class CanvasBlock {
    private state : BlockState = new BlockState()
    constructor(private i : number) {

    }
    draw(context : CanvasRenderingContext2D, w : number, h : number) {
        const factor : number = this.i%2
        const hGap : number = (h - w) * (factor)
        context.save()
        context.translate(w * this.i, hGap + hGap * (1 - 2 * factor))
        context.fillStyle = colors[this.i]
        context.fillRect(0, 0, w, w)
        context.restore()
    }
    update(stopcb : Function) {
        this.state.update(stopcb)
    }
    startUpdating(startcb : Function) {
        this.state.startUpdating(startcb)
    }
}
class CanvasBlockContainer {
    blocks : CanvasBlock[] = []
    state : BlocksStateContainer = new BlocksStateContainer(colors.length)
    constructor() {
        this.init()
    }
    init() {
        var i : number = 0
        for (; i < colors.length; i++) {
            this.blocks.push(new CanvasBlock(i))
        }
    }
    draw(context : CanvasRenderingContext2D) {
        const w : number = window.innerWidth / (2 * colors.length)
        const h : number = window.innerHeight
        this.blocks.forEach ((block) => {
            block.draw(context, w, h)
        })
    }
    update(stopcb : Function) {
        this.state.executeCB((j : number) => {
            this.blocks[j].update(() => {
                this.state.incrementCounter()
                stopcb()
            })
        })
    }
    startUpdating(startcb : Function) {
        this.state.executeCB((j : number) => {
            this.blocks[j].startUpdating(startcb)
        })
    }
}
class CanvasBlockStage {
    private canvas : HTMLCanvasElement = document.createElement('canvas');
    private context : CanvasRenderingContext2D;
    private container : CanvasBlockContainer = new CanvasBlockContainer();
    private animator : BlocksAnimator = new BlocksAnimator()
    constructor() {
        this.init()
    }
    init() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.context.fillStyle = '#212121'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.context = this.canvas.getContext('2d')
    }
    draw() {
        this.container.draw(this.context)
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            this.container.startUpdating(() => {
                this.animator.start(() => {
                    this.draw()
                    this.container.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

const stage : CanvasBlockStage = CanvasBlockStage()
stage.draw()
stage.handleTap()
