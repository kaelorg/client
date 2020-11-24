import 'dotenv/config';
import 'reflect-metadata';
import 'moment-duration-format';

import main from './main';
import load from './start/load';

load().then(() => main());
