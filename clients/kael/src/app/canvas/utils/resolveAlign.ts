import { AlignNumbers } from 'canvas';

import { Align } from '../config';

function resolveAlign(
  x: number,
  y: number,
  width: number,
  height: number,
  align: AlignNumbers,
): ResolvedAlign {
  const realCoords = { x, y };

  switch (align) {
    case Align.TopLeft:
      realCoords.y = y + height;
      break;
    case Align.TopCenter:
      realCoords.x = x - width * 0.5;
      realCoords.y = y + height;
      break;
    case Align.TopRight:
      realCoords.x = x - width;
      realCoords.y = y + height;
      break;
    case Align.CenterRight:
      realCoords.x = x - width;
      realCoords.y = y + height * 0.5;
      break;
    case Align.BottomRight:
      realCoords.x = x - width;
      break;
    case Align.BottomCenter:
      realCoords.x = x - width * 0.5;
      break;
    case Align.CenterLeft:
      realCoords.y = y + height * 0.5;
      break;
    case Align.Center:
      realCoords.x = x - width * 0.5;
      realCoords.y = y + height * 0.5;
      break;
    default:
  }

  return realCoords;
}

interface ResolvedAlign {
  x: number;
  y: number;
}

export default resolveAlign;
