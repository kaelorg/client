import { cloneObject } from '@packages/utils';
import { green, yellow, magenta } from 'chalk';
import { format, transports, LoggerOptions } from 'winston';

import makeDate from './utils/makeDate';
import parseMessage from './utils/parseMessage';

const { pid } = process;

const config: LoggerOptions = {
  level: 'silly',
  exitOnError: false,
  silent: process.env.NODE_ENV === 'test',
  transports: [new transports.Console()],
  format: format.combine(
    format(info => {
      const newInfo = cloneObject(info);

      newInfo.level = info.level.toUpperCase();
      return newInfo;
    })(),

    format.colorize({ all: true }),
    format.timestamp({ format: () => makeDate() }),

    format.printf(({ level, label, message, timestamp }) => {
      const content = [
        `[${green(timestamp)}]`,
        level,
        `(${yellow(`pid ${pid}`)})`,
        label && `[${magenta(`${label}`)}]`,
      ]
        .filter(Boolean)
        .join(' ');

      return `${content}: ${parseMessage(message)}`;
    }),
  ),
};

export default config;
