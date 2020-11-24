import logger from '@packages/logger';

import I18nextAdapter from '@core/adapters/I18nextAdapter';

/**
 * Loads i18next settings.
 */
async function i18nextLoader(): Promise<void> {
  await I18nextAdapter.init();

  logger.info('The i18next settings was started successfully.', {
    label: 'i18next-loader',
  });
}

export default i18nextLoader;
