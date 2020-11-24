function makeScope(package) {
  return `--scope ${package}`;
}

function concatName(name, package) {
  return `@${name}/${package}`;
}

function makeConcatNameFunction(name) {
  return package => concatName(name, package);
}

module.exports = {
  makeScope,
  concatName,
  makeConcatNameFunction,
};
