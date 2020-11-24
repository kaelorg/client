import { Context2d } from 'canvas';

function measureText(
  ctx: Context2d,
  text: keyof any,
  font?: string,
): MeasuredText {
  const oldFold = ctx.font;

  if (font) {
    // Apply the font to the context
    ctx.font = font;
  }

  const measure = ctx.measureText(text.toString());

  // Place the source that was before the process
  ctx.font = oldFold;

  return {
    width: measure.width,
    height: measure.actualBoundingBoxAscent,
  };
}

interface MeasuredText {
  width: number;
  height: number;
}

export default measureText;
