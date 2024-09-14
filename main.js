'use strict';

import Drawing from "./Drawing.js";
import options from "./optionTypes.js";

const $ = (value) => document.getElementById(value);
const $$ = (value) => document.querySelectorAll(value);

const canvas = $('canva');
const colorSelector = $('color-selector');
const trash = $('trash');
const picker = $('picker');
const notSupported = $('notSupported');

const actionButtons = $$(".icon");

const ctx = canvas.getContext('2d');

const drawingMethods = new Drawing(ctx);
const widthCanvas = 400;
const heightCanvas = 300;

let currentAction = options.nothing;
let pressed = false;

let snapshot;

//verify if other btn action is active already
const isBtnActive = (button) => {
    if (button.classList.contains('icon-active')) return;
    actionButtons.forEach(btn => btn.classList.contains('icon-active') && btn.classList.remove('icon-active'));
}

actionButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        isBtnActive(btn);//disable other actions active when new one is being activated
        btn.classList.toggle('icon-active');
        currentAction = btn.classList.contains('icon-active') ? btn.id : options.nothing;//set the current action as the selected by the user

        switch (currentAction) {
            case options.draw: document.body.style.cursor = `url('./cursors/pincel.png'), auto`;
                break;
            case options.rectangle: document.body.style.cursor = `url('./cursors/point.png'), auto`;
                break;
            case options.erase: document.body.style.cursor = `url('./cursors/erase.png'), auto`;
                break;
            case options.ellipse: document.body.style.cursor = `url('./cursors/point.png'), auto`;
                break;
            default: document.body.style.cursor = '';
                break;
        }

        if (btn.id === 'picker') {
            drawingMethods.picker();
            currentAction = options.nothing;
        }
    });

});

canvas.addEventListener("mousedown", (e) => {
    pressed = true;
    [drawingMethods.lastX, drawingMethods.lastY] = [e.offsetX, e.offsetY];
    [drawingMethods.originX, drawingMethods.originY] = [e.offsetX, e.offsetY];
    snapshot = ctx.getImageData(0, 0, widthCanvas, heightCanvas);
});

canvas.addEventListener("mousemove", (e) => {
    if (pressed) {

        switch (currentAction) {
            case options.draw: drawingMethods.draw(e.offsetX, e.offsetY);
                break;
            case options.rectangle:
                drawingMethods.rectangle(e.offsetX, e.offsetY, snapshot);
                break;
            case options.erase:
                drawingMethods.erase(e.offsetX, e.offsetY);
                break;
            case options.ellipse:
                drawingMethods.ellipsis(e.offsetX, e.offsetY, snapshot);
                break;
        }
    }
});

if (!window.EyeDropper) {
    picker.setAttribute('disabled', '');
    picker.classList.add('disabled');
    notSupported.showModal();

    notSupported.addEventListener('click', (e) => {
        const modalDimensions = notSupported.getBoundingClientRect();
        if (e.clientX < modalDimensions.left || e.clientX > modalDimensions.right || e.clientY < modalDimensions.top || e.clientY > modalDimensions.bottom) {
            notSupported.close();
        }
    });
}

canvas.addEventListener("mouseup", () => {
    pressed = false
});

colorSelector.addEventListener("change", (e) => {
    drawingMethods.changeColor(e.target.value);
}, false);

trash.addEventListener('click', () => {
    currentAction = options.nothing;
    drawingMethods.trash();
    setTimeout(() => trash.classList.remove('icon-active'), 100);
});