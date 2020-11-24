import { Context2d } from 'canvas';

import measureText from './measureText';

function splitText({ ctx, text, font, completeWidth }: SplitTextData): string {
  const textSplited = text
    .toString()
    .split(' ')
    .map(word => {
      const { width } = measureText(ctx, word, font);

      if (width > completeWidth) {
        const wordsScaped = [];

        const letters = word.split('');
        const maxIndex = Math.floor(
          letters.findIndex((_, j) => {
            const letterWord = letters.slice(0, j + 1).join('');
            const wordText = measureText(ctx, letterWord, font);

            if (wordText.width <= completeWidth) return false;
            return true;
          }) * 0.5,
        );

        const splitTextLength = Math.floor(word.length / maxIndex);

        let inIndex = 0;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < splitTextLength + 1; i++) {
          let max = maxIndex * (i + 1);

          if (i === splitTextLength) {
            max = word.length;
          }

          wordsScaped.push(letters.slice(inIndex, max).join(''));
          inIndex += maxIndex;
        }

        return wordsScaped.join('- ');
      }

      return word;
    });

  return textSplited.join(' ');
}

interface SplitTextData {
  font: string;
  text: keyof any;
  ctx: Context2d;
  completeWidth: number;
}

export default splitText;
