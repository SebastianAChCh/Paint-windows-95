export default class Drawing {
    originX = 0;
    originY = 0;

    lastX = 0;
    lastY = 0;

    color = '#000';

    ctx;

    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.strokeStyle = this.color;
    }

    draw(offsetX, offsetY, operationMode = 'draw') {
        this.ctx.strokeStyle = this.color;
        let y;
        let x;
        [x, y] = [offsetX, offsetY];

        this.ctx.lineWidth = operationMode != 'draw' ? 15 : 1;
        this.ctx.globalCompositeOperation = operationMode != 'draw' ? "destination-out" : 'source-over';
        // this.ctx.
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        [this.lastX, this.lastY] = [x, y];
    }

    ellipsis(offsetX, offsetY, snapshot) {
        this.ctx.putImageData(snapshot, 0, 0);
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.color;

        if (!this.originX) {
            this.originX = offsetX;
            this.originY = offsetY;
        }

        let radiusX = Math.abs(offsetX - this.originX);
        let radiusY = Math.abs(offsetY - this.originY);

        this.ctx.beginPath();
        this.ctx.ellipse(this.originX, this.originY, radiusX, radiusY, 0, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    rectangle(offsetX, offsetY, snapshot) {
        this.ctx.strokeStyle = this.color;
        this.ctx.putImageData(snapshot, 0, 0);
        this.ctx.lineWidth = 1;
        this.ctx.globalCompositeOperation = 'source-over';

        if (this.originX == 0) {
            this.originX = offsetX;
            this.originY = offsetY;
        }

        let width = (offsetX - this.originX);
        let height = (offsetY - this.originY);

        this.ctx.beginPath();
        this.ctx.rect(this.originX, this.originY, width, height);
        this.ctx.stroke();

    }

    picker() {
        const picker = document.getElementById('color-selector');

        const eyeDropper = new EyeDropper();

        eyeDropper
            .open()
            .then((result) => {
                this.color = result.sRGBHex;
                picker.value = result.sRGBHex;
                document.getElementById('picker').classList.remove('icon-active');
            })
            .catch((e) => {
                console.error(e);
            });
    }

    erase(offsetX, offsetY) {
        this.draw(offsetX, offsetY, 'erase');
    }

    trash() {
        let heightCanvas = 300;
        let widthCanvas = 400;

        this.ctx.globalCompositeOperation = 'destination-out';

        this.ctx.beginPath();
        this.ctx.rect(0, 0, widthCanvas, heightCanvas);
        this.ctx.fill();
    }

    changeColor(color) {
        this.color = color;
    }

}