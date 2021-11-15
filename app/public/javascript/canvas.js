const CanvasContainer = document.getElementById("CanvasContainer")
const canvas = document.getElementById('myCanvas');
const canvasColorPicker = document.getElementById('canvasColorPicker');
const canvasStrokeSize = document.getElementById('canvasStrokeSize');
const canvasBrush = document.getElementById('canvasBrush');
const canvasErase = document.getElementById('canvasErase');
const canvasDownload = document.getElementById('canvasDownload');
const canvasUpload = document.getElementById("canvasUpload");
const cleanCanvas = document.getElementById("cleanCanvas");
const saveToDatabaseBtn = document.getElementById("saveToDatabaseBtn");
const paintToggleBtn = document.getElementById("paintToggleBtn");
const closeCanvasContainerSection = document.getElementById("closeCanvasContainerSection");

let saveToDatabase = true;
let binaryCanvasValue = null;

let canvasValues = {
    color: canvasColorPicker.value,
    stroke: canvasStrokeSize.value,
    figure: "round",
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
        case "squareBrush":
            canvasValues.figure = targetValue;
            break;
        case "circleBrush":
            canvasValues.figure = targetValue;
            break;
        case "flatBrush":
            canvasValues.figure = targetValue;
            break;
        default:
            canvasValues.x = e.clientX
            canvasValues.y = e.clientY
            break;
    }
}

function eraseCanvasValues() {
    canvasErase.classList.toggle("active")
    if (!canvasValues.isErasing) {
        canvasValues.isErasing = true;
        return;
    }
    canvasValues.isErasing = false;
}

// Sets the width for off-canvas for CanvasContainer first time user loads the page. Reason: css and the effects clashes with the calculation of  rescaleCanvas()

// let firstTimeLoadingPage = true;
// let userResizedWindow = true
// function initWidth() {
//     if (firstTimeLoadingPage & userResizedWindow) {
//         firstTimeLoadingPage = false;
//         userResizedWindow = false
//         setTimeout(() => {
//             rescaleCanvas()
//         }, 500);
//     }
//     return
// }

function getTotalHeightOfElements() {
    const offCanvasHeader = document.getElementById("CanvasHeaderId");
    const offCanvasFooter = document.getElementById("canvasToolBar");
    const HeaderRect = offCanvasHeader.getBoundingClientRect();
    const ToolBarRect = offCanvasFooter.getBoundingClientRect();
    const marginBottom = getComputedStyle(offCanvasHeader).marginBottom;
    const marginTop = getComputedStyle(offCanvasFooter).marginTop;
    // console.log(HeaderRect.height, ToolBarRect.height, parseInt(marginBottom), parseInt(marginTop));
    return HeaderRect.height + ToolBarRect.height + parseInt(marginBottom) + parseInt(marginTop);
}

function rescaleCanvas() {
    const totalElementsHeight = getTotalHeightOfElements()
    console.log(totalElementsHeight);
    canvas.height = window.innerHeight - totalElementsHeight;
    canvas.width = window.innerWidth - 2;
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

function startPainting() {
    setCanvasOffSet();
    isPainting = true;
} 

const finishPainting = () => {
    isPainting = false;
    ctx.beginPath();
}

const paint = (e) => {
    if (!isPainting) return;
    ctx.lineWidth = canvasValues.stroke;
    ctx.strokeStyle = !canvasValues.isErasing ? canvasValues.color : "white";
    ctx.lineCap = canvasValues.figure;
    ctx.lineJoin = canvasValues.figure;
    ctx.lineTo(e.clientX - canvasOffsetForClient.offsetX, e.clientY - canvasOffsetForClient.offsetY);
    ctx.stroke();
    setCanvasValues(e)
}

// Fix this confirm....
function downloadCanvasImg() {
        const link = document.createElement('a');
        link.download = 'download.png';
        link.href = canvas.toDataURL();
        link.click();
        link.delete;
}

function setSaveToDatabaseOption() {
    console.log("current", saveToDatabase);
    if(saveToDatabase) {
        saveToDatabase = false;
        console.log("setting false", saveToDatabase);
        return;
    } 
    saveToDatabase = true;
    console.log("setting true", saveToDatabase);
}

function uploadCanvasImg() {
    activeElement(paintToggleBtn)
    displayOfCanvas(CanvasContainer)
        checkIfTypingImgShouldHidden()
        binaryCanvasValue = canvas.toDataURL();
        appendToTypingContainer(binaryCanvasValue);
    return;
}

// Enables touch control! 
function touchstart(event) {
    startPainting(event.touches[0])
}

function touchmove(event) {
    paint(event.touches[0]);
    event.preventDefault();
}

function touchend(event) {
    finishPainting(event.changedTouches[0])
}

canvas.addEventListener('touchstart', touchstart, false);
canvas.addEventListener('touchmove', touchmove, false);
canvas.addEventListener('touchend', touchend, false);

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mousemove', paint);
canvas.addEventListener('mouseup', finishPainting);

// Enables touch control! 
function touchChooseStroke(event) {
    setCanvasValues(event.changedTouches[0])
}
canvasStrokeSize.addEventListener('touchend', touchChooseStroke, false);

canvasStrokeSize.addEventListener('mouseup', setCanvasValues);
canvasColorPicker.addEventListener('change', setCanvasValues);

canvasBrush.addEventListener('change', setCanvasValues);

canvasErase.addEventListener('click', () => {
    eraseCanvasValues();
    activeElement(canvasErase);
});
canvasDownload.addEventListener('click', downloadCanvasImg);
canvasUpload.addEventListener("click", () => {
    console.log("lol");
    !clientLookingAtBrowserWindow ? clientLookingAtBrowserWindow = true : clientLookingAtBrowserWindow = false;
    !offCanvasIsActive ? offCanvasIsActive = true : offCanvasIsActive = false
    resetNewMessageNotifications();
    uploadCanvasImg()
});
cleanCanvas.addEventListener("click", cleanAllCanvas);
paintToggleBtn.addEventListener("click", () => {
    clientLookingAtBrowserWindow ? clientLookingAtBrowserWindow = false : clientLookingAtBrowserWindow = true;
    offCanvasIsActive ? offCanvasIsActive = false : offCanvasIsActive = true;
    displayOfCanvas(CanvasContainer);
    activeElement(paintToggleBtn);
});
saveToDatabaseBtn.addEventListener("click", () => {
    setSaveToDatabaseOption();
    activeElement(saveToDatabaseBtn);
})
closeCanvasContainerSection.addEventListener("click", () => {
    // clientLookingAtBrowserWindow = true;
    !clientLookingAtBrowserWindow ? clientLookingAtBrowserWindow = true : clientLookingAtBrowserWindow = false;
    !offCanvasIsActive ? offCanvasIsActive = true : offCanvasIsActive = false
    resetNewMessageNotifications();
    displayOfCanvas(CanvasContainer);
    activeElement(paintToggleBtn);
});

window.addEventListener("resize", () => {
    setCanvasOffSet()
    rescaleCanvas()
}, false);

// Sets the width for off-canvas for CanvasContainer first time user loads the page. Reason: css and the effects clashes with the calculation of  rescaleCanvas()
document.addEventListener('DOMContentLoaded', function() {
    rescaleCanvas()
 }, false);

