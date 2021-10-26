const CanvasContainer = document.getElementById("CanvasContainer")
const canvas = document.getElementById('myCanvas');
const canvasColorPicker = document.getElementById('canvasColorPicker');
const canvasStrokeSize = document.getElementById('canvasStrokeSize');
const canvasFigure = document.getElementById('canvasFigure');
const canvasErase = document.getElementById('canvasErase');
const canvasDownload = document.getElementById('canvasDownload');
const canvasUpload = document.getElementById("canvasUpload");
const cleanCanvas = document.getElementById("cleanCanvas");
const saveToDatabaseBtn = document.getElementById("saveToDatabaseBtn");
const paintToggleBtn = document.getElementById("paintToggleBtn");
const closeCanvasContainerSection = document.getElementById("closeCanvasContainerSection");

let saveToDatabase = null;
let binaryCanvasValue = null;

let canvasValues = {
    color: canvasColorPicker.value,
    stroke: canvasStrokeSize.value,
    figure: canvasFigure.value,
    isErasing: false,
    x: 0,
    y: 0
}

let canvasOffsetForClient = {
    offsetX: null,
    offsetY: null
}

function resetBinaryCanvasValue() {
    binaryCanvasValue = "";
}

function setCanvasValues(e) {
    if (!e) {
        return;
    }
    const target = e.target.id;
    const targetValue = e.target.value;
    switch (target) {
        case "canvasColorPicker":
            canvasValues.color = targetValue;
            break;
        case "canvasStrokeSize":
            canvasValues.stroke = targetValue;
            break;
        case "canvasFigure":
            canvasValues.figure = targetValue;
            break;
        case "canvasErase":
            canvasErase.classList.toggle("active")
            if (!canvasValues.isErasing) {
                canvasValues.isErasing = true;
                return;
            }
            canvasValues.isErasing = false;
            break;
        default:
            canvasValues.x = e.clientX
            canvasValues.y = e.clientY
            break;
    }
}

function rescaleCanvas() {
    canvas.height = window.innerHeight / 1.7;
    canvas.width = window.innerWidth / 1.1;
}

const ctx = canvas.getContext('2d');
let isPainting = false;

function cleanAllCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setCanvasOffSet() {
    const getBounding = canvas.getBoundingClientRect();
    canvasOffsetForClient.offsetX = getBounding.left;
    canvasOffsetForClient.offsetY = getBounding.top;
}

const startPainting = () => isPainting = true;

const finishPainting = () => {
    isPainting = false;
    ctx.beginPath();
}

const paint = (e) => {
    if (!isPainting) return;
    ctx.lineWidth = canvasValues.stroke;
    ctx.strokeStyle = !canvasValues.isErasing ? canvasValues.color : "white";
    ctx.lineCap = canvasValues.figure;
    ctx.lineTo(e.clientX - canvasOffsetForClient.offsetX, e.clientY - canvasOffsetForClient.offsetY);
    ctx.stroke();
    setCanvasValues(e)
}

// Fix this confirm....
function downloadCanvasImg() {
    if (confirm("do you want to download this pic?")) {
        // console.log(canvas.toDataURL());
        const link = document.createElement('a');
        link.download = 'download.png';
        link.href = canvas.toDataURL();
        link.click();
        link.delete;
    }
    return;
}

// TODO... Remember to NOT save this and post it as toDataURL.. Save it to server
function uploadCanvasImg() {
    activeElement(paintToggleBtn)
    if (confirm("Do you want to upload this pic?")) {
        CanvasContainer.classList.toggle("hidden");
        checkIfTypingImgShouldHidden()
        binaryCanvasValue = canvas.toDataURL();
        // TODO validation on client side.....

        console.log(saveToDatabaseBtn.checked);
        saveToDatabase = saveToDatabaseBtn.checked;
        appendToTypingContainer(binaryCanvasValue);
    }
    return;
}

rescaleCanvas()

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mousemove', paint);
canvas.addEventListener('mouseup', finishPainting);
canvasStrokeSize.addEventListener('mouseup', setCanvasValues);
canvasColorPicker.addEventListener('change', setCanvasValues);
canvasFigure.addEventListener('change', setCanvasValues);
canvasErase.addEventListener('click', (e) => {
    setCanvasValues(e);
    activeElement(canvasErase);
});
canvasDownload.addEventListener('click', downloadCanvasImg);
canvasUpload.addEventListener("click", uploadCanvasImg);
cleanCanvas.addEventListener("click", cleanAllCanvas);
paintToggleBtn.addEventListener("click", () => {
    hideElement(CanvasContainer);
    activeElement(paintToggleBtn);
});
closeCanvasContainerSection.addEventListener("click", () => {
    hideElement(CanvasContainer);
    activeElement(paintToggleBtn);
});

// TODO There has to be a better than to do this.... I want to set offSet whenever I  do something related to canvas...
window.addEventListener("click", setCanvasOffSet, false);
window.addEventListener("scroll", setCanvasOffSet, false);
window.addEventListener("load", setCanvasOffSet, false);
window.addEventListener("resize", () => {
    setCanvasOffSet()
    rescaleCanvas()
}, false);