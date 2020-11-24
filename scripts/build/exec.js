const { exec: defaultExec } = require('child_process');
const { promisify } = require('util');

const { scripts, lernaCommandBase } = require('./config');

const execPromise = promisify(defaultExec);

function exec(script, { command = '', parallel = true } = {}) {
  const parallelFlag = parallel ? '--parallel' : '';
  const scriptGetted = scripts[script];
  const makedCommand = `${lernaCommandBase} ${parallelFlag} ${command} -- ${scriptGetted}`;

  return execPromise(makedCommand);
}

module.exports = exec;
