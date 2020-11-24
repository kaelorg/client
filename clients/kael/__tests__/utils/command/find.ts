import { Command } from '../../../src/interfaces';

function find(
  { name, options: { aliases } }: Command,
  commandIndex: number,
  allCommands: Command[],
) {
  const allCommandsFiltered = allCommands.filter(
    (_, currentIndex) => currentIndex !== commandIndex,
  );

  return allCommandsFiltered.some(
    ({ name: currentName, aliases: currentAliases }) => {
      return (
        currentName === name ||
        aliases.some(aliase => currentAliases.has(aliase))
      );
    },
  );
}

export default find;
