type ShuffleArrayReturn<
  T extends Array<any>,
  B extends boolean
> = B extends true ? T[number] : T;

export function shuffleArray<T extends Array<any>, B extends boolean = false>(
  array: T,
  getOne: B = false as B,
): ShuffleArrayReturn<T, B> {
  const shuffledArray = array;

  // eslint-disable-next-line no-plusplus
  for (let index = array.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffledArray[index], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[index],
    ];
  }

  if (getOne) {
    return shuffledArray[Math.floor(Math.random() * shuffledArray.length)];
  }

  return shuffledArray as ShuffleArrayReturn<T, B>;
}
