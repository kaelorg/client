import { CanvasRenderingContext2D } from 'canvas';

import { Align } from '@app/canvas/config';

declare module 'canvas' {
  type AlignNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  class AppliedRenderingContext2D extends CanvasRenderingContext2D {
    printAt(
      text: keyof any,
      x: number,
      y: number,
      lineHeight: number,
      fitWidth?: number,
      font?: string,
    ): number;

    roundFill(
      x: number,
      y: number,
      width: number,
      height: number,
      radius?: number,
    ): this;

    roundImage(
      image: Image | Canvas,
      x: number,
      y: number,
      imageWidth?: number,
      imageHeight?: number,
      radius?: number,
    ): this;

    roundImageCanvas(
      image: Image | Canvas,
      imageWidth?: number,
      imageHeight?: number,
      radius?: number,
    ): Canvas;

    roundRect(
      x: number,
      y: number,
      width: number,
      height: number,
      radius:
        | number
        | {
            upperLeft: number;
            upperRight: number;
            lowerLeft: number;
            lowerRight: number;
          },
      fill: boolean,
      stroke: boolean,
    ): this;

    write(
      text: keyof any,
      x: number,
      y: number,
      align?: AlignNumbers,
      font?: string,
    ): {
      width: number;
      height: number;
      leftX: number;
      bottomY: number;
      topY: number;
      rightX: number;
      centerX: number;
      centerY: number;
    };
  }

  class Context2d extends AppliedRenderingContext2D {} // eslint-disable-line @typescript-eslint/no-unused-vars
}
