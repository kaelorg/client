import { mergeDefault } from '@packages/utils';
import { createLogger, Logger, LoggerOptions } from 'winston';

import config from './config';

function makeLogger(options: LoggerOptions = {}): Logger {
  return createLogger(mergeDefault(config, options));
}

export default makeLogger;
