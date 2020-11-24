import makeLogger from './makeLogger';

const logger = makeLogger();

export { makeLogger };
export type { Logger } from 'winston';

export default logger;
