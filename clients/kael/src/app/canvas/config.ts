import { AlignNumbers } from 'canvas';

export const Align: Record<AlignKeys, AlignNumbers> = {
  TopLeft: 1,
  TopCenter: 2,
  TopRight: 3,
  CenterRight: 4,
  BottomRight: 5,
  BottomCenter: 6,
  BottomLeft: 7,
  CenterLeft: 8,
  Center: 9,
};

type AlignKeys =
  | 'TopLeft'
  | 'TopCenter'
  | 'TopRight'
  | 'CenterRight'
  | 'BottomRight'
  | 'BottomCenter'
  | 'BottomLeft'
  | 'CenterLeft'
  | 'Center';
