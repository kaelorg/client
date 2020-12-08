import logger from '@packages/logger';
import { init } from '@sentry/node';

/**
 * Loads sentry Client.
 */
function sentryLoader(): void {
  if (process.env.NODE_ENV !== 'production' || !process.env.SENTRY_DSN) {
    return;
  }

  init({ dsn: process.env.SENTRY_DSN });

  logger.info('The sentry client has been successfully initialized.', {
    label: 'sentry-loader',
  });
}

export default i18nextLoader;
