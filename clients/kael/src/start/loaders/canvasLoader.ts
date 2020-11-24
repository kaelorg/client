import logger from '@packages/logger';

import load from '@app/canvas/load';

/**
 * Loads canvas applied methods.
 */
function canvasLoader(): void {
  load();

  logger.info('Methods applied to Context2d have been successfully loaded.', {
    label: 'canvas-loader',
  });
}

export default canvasLoader;
