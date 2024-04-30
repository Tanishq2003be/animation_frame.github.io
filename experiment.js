class Experiment {
    // Group Details
    static rollNos = '102117154,102117146'
    static names = 'Tiny Coders(Tanishq Dublish , Anshul Garg)'

    canvasSel = 'webglCanvas'

    run() {

        // Run the Steppers
        // this.runSteppers()

        // Hide Steppers
        // this.hideSteppers()
        canvasSetup(this.canvasSel)

        // Clock
        // --------------------------------------------------
        const animation = new DawnToDuskRenderer(this.canvasSel);
        const startit = () => {
            animation.animate();
            window.requestAnimationFrame(startit);
        };
        // const ms = document.timeline.currentTime
        // clock.draw(ms)
        // clock.draw(ms+25000)
    }
}