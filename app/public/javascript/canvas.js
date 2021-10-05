"use strict";

const canvas = document.getElementById('myCanvas');
const canvasColorPicker = document.getElementById('canvasColorPicker');
const canvasStrokeSize = document.getElementById('canvasStrokeSize');
const canvasFigure = document.getElementById('canvasFigure');
const canvasErase = document.getElementById('canvasErase');
const canvasDownload = document.getElementById('canvasDownload');

let canvasValues = {
    color: canvasColorPicker.value,
    stroke: canvasStrokeSize.value,
    figure: canvasFigure.value,
    isErasing: false,
    x: 0,
    y: 0
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

function sendToServer() {
    console.log('This is going to be sent.. And updated..!', canvasValues);
}

// Set height... TODO...
const heightRatio = 1.5;
canvas.height = canvas.width * heightRatio;

// TODO use classes instead?

const ctx = canvas.getContext('2d');

let isPainting = false;
const startPainting = () => isPainting = true;

const finishPainting = () => {
    isPainting = false;
    ctx.beginPath(); // stops current and create new path
}

const paint = (e) => {
    if (!isPainting) return;
    ctx.lineWidth = canvasValues.stroke;
    ctx.strokeStyle = !canvasValues.isErasing ? canvasValues.color : "white";
    ctx.lineCap = canvasValues.figure;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.moveTo(e.clientX, e.clientY);
    setCanvasValues(e)
    sendToServer()
}

function downloadCanvasImg() {
    if(confirm("do you want to download this pic?")) {
    console.log(canvas.toDataURL());
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
    }
    return;
}

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mousemove', paint);
canvas.addEventListener('mouseup', finishPainting);
canvasStrokeSize.addEventListener('mouseup', setCanvasValues);
canvasColorPicker.addEventListener('change', setCanvasValues);
canvasFigure.addEventListener('change', setCanvasValues);
canvasErase.addEventListener('click', setCanvasValues);
canvasDownload.addEventListener('click', downloadCanvasImg);
