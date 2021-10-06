"use strict";

const canvas = document.getElementById('myCanvas');
const canvasColorPicker = document.getElementById('canvasColorPicker');
const canvasStrokeSize = document.getElementById('canvasStrokeSize');
const canvasFigure = document.getElementById('canvasFigure');
const canvasErase = document.getElementById('canvasErase');
const canvasDownload = document.getElementById('canvasDownload');
const canvasUpload = document.getElementById("canvasUpload");

// TODO Remove this button and event and create something else
document.getElementById("toggleCanvas").addEventListener("click", (e) => {
    e.target.classList.toggle("active")
    document.getElementById("CanvasContainer").classList.toggle("hidden")});

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
    // TODO Need to rewrite much of the code for multiplayer...
    console.log('This is going to be sent.. And updated..!', canvasValues);
}

// Set height... TODO... Borrow Henry...
// const heightRatio = 1.5;
// canvas.height = canvas.width * heightRatio;


// TODO use classes instead?
function setCanvasOffSet() {
    console.log("yo");
    const getBounding = canvas.getBoundingClientRect();
    canvasOffsetForClient.offsetX = getBounding.left;
    canvasOffsetForClient.offsetY = getBounding.top;
}

const ctx = canvas.getContext('2d');
let isPainting = false;
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
    // TODO.. Maybe needed later?
    // ctx.moveTo(e.clientX, e.clientY);
    setCanvasValues(e)
    sendToServer()
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
    if (confirm("do you want to upload this pic?")) {
        // dataURL = canvas.toDataURL();
        alert("uploaded!");
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
canvasUpload.addEventListener("click", uploadCanvasImg);

// TODO There has to be a better than to do this.... I want to set offSet whenever I  do something related to canvas...
window.addEventListener("click", setCanvasOffSet, false)
window.addEventListener("resize", setCanvasOffSet, false)
window.addEventListener("scroll", setCanvasOffSet, false)
window.addEventListener("load", setCanvasOffSet, false)


// Idea to decrease event listeners? 
// ['click','ontouchstart'].forEach( evt => 
//     element.addEventListener(evt, dosomething, false)
// );