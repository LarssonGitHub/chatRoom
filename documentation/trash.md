






// "use strict";

// const canvas = document.getElementById('myCanvas');
// const canvasColorPicker = document.getElementById('canvasColorPicker');
// const canvasStrokeSize = document.getElementById('canvasStrokeSize');
// const canvasFigure = document.getElementById('canvasFigure');

// // function getElementById(el) {
// //     return document.getElementById(el);
// //   }

// // Set height... TODO...
// const heightRatio = 1.5;
// canvas.height = canvas.width * heightRatio;

// // TODO use classes instead?

// let canvasValues = {
//     color: canvasColorPicker.value,
//     stroke: canvasStrokeSize.value,
//     figure: canvasFigure.value,
//     x: 0,
//     y: 0
// }

// const ctx = canvas.getContext('2d');

// let isPainting = false;
// const startPainting = () => isPainting = true;

// const finishPainting = () => {
//     isPainting = false;
//     ctx.beginPath(); // stops current and create new path
// }

// const paint = (e) => {
//     if (!isPainting) return;
//     ctx.lineWidth = canvasValues.stroke;
//     ctx.strokeStyle = String(canvasValues.color);
//     ctx.lineCap = canvasValues.figure;
//     ctx.lineTo(e.clientX, e.clientY); 
//     ctx.stroke(); 
//     ctx.moveTo(e.clientX, e.clientY); // Update cursor position (perhaps optional?)

// }

// // TODO make so you can click.. Not only drag
// canvas.onmousedown = startPainting;
// canvas.onmousemove = paint;
// canvas.onmouseup = finishPainting;

// // TODO write fewer event listeners.. EVENT DELIGATION
// canvasStrokeSize.addEventListener('mouseup', (e) => {
//     const targetValue = e.target.value;
//     canvasValues.stroke = targetValue;
// })

// canvasColorPicker.addEventListener('change', (e) => {
//     const targetValue = e.target.value;
//     canvasValues.color = targetValue;
// })

// canvasFigure.addEventListener('change', (e) => {
//     const targetValue = e.target.value;
//     canvasValues.figure = targetValue;
// })