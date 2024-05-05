// let getDom = (...args) => (document.querySelector(...args))
const getDom = document.querySelector.bind(document)

function canvasSetup(sel) {
    const { canvas, bb: { width: W, height: H } } = getCanvas(sel)
    canvas.width = 300
    canvas.height = 150

    setTimeout(() => {
        canvas.width = parseFloat(W)
        canvas.height = parseFloat(H)
    }, 0)
}

function getCanvas(sel, context = 'webgl') {
    const canvas = getDom(sel)
    return {
        canvas,
        ctx: canvas.getContext(context),
        bb: canvas.getBoundingClientRect()
    }
}