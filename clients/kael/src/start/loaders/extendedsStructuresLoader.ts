import logger from '@packages/logger';
import { resolve } from 'path';

import readFolder from '../utils/readFolder';

/**
 * Loads all classes that will implement methods in some discord.js structure.
 */
function extendedsStructuresLoader(): void {
  readFolder<void>(
    resolve(__dirname, '..', '..', 'core', 'structures', 'extendeds'),
  );

  logger.info('All extensible classes have been successfully extended.', {
    label: 'extendeds-structures-loader',
  });
}

export default extendedsStructuresLoader;
