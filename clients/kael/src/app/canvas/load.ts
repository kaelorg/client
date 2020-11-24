import { createCanvas, Context2d } from 'canvas';

import { Align } from './config';
import measureText from './utils/measureText';
import resolveAlign from './utils/resolveAlign';
import splitText from './utils/splitText';

function load(): void {
  //
  Context2d.prototype.roundFill = function roundFill(
    x,
    y,
    width,
    height,
    radius = width * 0.5,
  ) {
    this.beginPath();
    this.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2, true);
    this.closePath();
    this.fill();

    return this;
  };

  //
  Context2d.prototype.roundImage = function roundImage(
    image,
    x,
    y,
    imageWidth,
    imageHeight,
    radius,
  ) {
    const imageRounded = this.roundImageCanvas(
      image,
      imageWidth,
      imageHeight,
      radius,
    );

    this.drawImage(imageRounded, x, y, imageWidth, imageHeight);
    return this;
  };

  //
  Context2d.prototype.roundImageCanvas = function roundImageCanvas(
    image,
    imageWidth = image.width,
    imageHeight = image.height,
    radius = imageWidth * 0.5,
  ) {
    const canvas = createCanvas(imageWidth, imageHeight);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'source-over';

    ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

    ctx.fillStyle = '#fff';
    ctx.globalCompositeOperation = 'destination-in';

    ctx.beginPath();
    ctx.arc(imageWidth * 0.5, imageHeight * 0.5, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return canvas;
  };

  //
  Context2d.prototype.write = function write(
    text,
    x,
    y,
    align = Align.BottomLeft as 7,
    font,
  ) {
    const currentFont = this.font;
    font = this.font = font || currentFont; // eslint-disable-line no-multi-assign,no-param-reassign

    const { width, height } = measureText(this, text, font);
    const { x: realX, y: realY } = resolveAlign(x, y, width, height, align);

    this.fillText(text.toString(), realX, realY);
    return {
      width,
      height,
      leftX: realX,
      bottomY: realY,
      topY: realY - height,
      rightX: realX + width,
      centerX: realX + width * 0.5,
      centerY: realY - height * 0.5,
    };
  };

  //
  Context2d.prototype.printAt = function printAt(
    text,
    x,
    y,
    lineHeight,
    fitWidth = x + y,
    font,
  ) {
    const currentFont = this.font;
    font = this.font = font || currentFont; // eslint-disable-line no-multi-assign,no-param-reassign

    const wordsRenders = [];
    const completeWidth = fitWidth * 1.5;
    const words = splitText({
      text,
      font,
      ctx: this,
      completeWidth,
    }).split(' ');

    let inX = x;
    let inHeight = y;

    for (const word of words) {
      const { width, height } = measureText(this, `${word} `, font);

      if (inX + width > completeWidth) {
        inHeight += lineHeight;
        inX = x;
      }

      wordsRenders.push({ x: inX, y: inHeight, word, width, height });
      inX += width;
    }

    for (const word of wordsRenders) {
      const { x: wordX, y: wordY, word: wordText } = word;

      this.fillText(wordText, wordX, wordY);
    }

    return (
      inHeight + wordsRenders.map(word => word.height).sort((a, b) => a + b)[0]
    );
  };

  //
  Context2d.prototype.roundRect = function roundRect(
    x,
    y,
    width,
    height,
    radius,
    fill = false,
    stroke = false,
  ) {
    let cornerRadius = {
      upperLeft: 0,
      upperRight: 0,
      lowerLeft: 0,
      lowerRight: 0,
    };

    if (typeof radius === 'object') {
      cornerRadius = Object.assign(cornerRadius, radius);
    } else if (typeof radius === 'number') {
      cornerRadius = {
        upperLeft: radius,
        upperRight: radius,
        lowerLeft: radius,
        lowerRight: radius,
      };
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(
      x + width,
      y + height,
      x + width - cornerRadius.lowerRight,
      y + height,
    );
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(
      x,
      y + height,
      x,
      y + height - cornerRadius.lowerLeft,
    );
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();

    if (stroke) this.stroke();
    if (fill) this.fill();

    return this;
  };
}

export default load;
