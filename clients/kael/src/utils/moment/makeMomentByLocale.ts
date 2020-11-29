import { cloneObject } from '@packages/utils';
import moment, {
  localeData,
  Locale,
  Moment,
  MomentInput,
  MomentFormatSpecification,
} from 'moment';

import config from './config';
import isValidLocale from './isValidLocale';

function makeMomentByLocale(locale: string): typeof moment {
  const myMoment = (
    inp?: MomentInput,
    format?: MomentFormatSpecification,
    language?: string,
    strict?: boolean,
  ): Moment => {
    let myLocale: Locale = localeData(config.defaultLocale);
    const momentGenerated = moment(inp, format, language, strict);

    if (isValidLocale(locale)) {
      myLocale = localeData(locale);
    }

    momentGenerated.locale(myLocale._abbr);
    return momentGenerated;
  };

  const momentCloned = cloneObject(moment);
  const properties = Object.getOwnPropertyNames(
    momentCloned,
  ).reduce<PropertyDescriptorMap>(
    (descriptor, property) =>
      Object.assign(descriptor, {
        [property]: Object.getOwnPropertyDescriptor(
          momentCloned,
          property,
        ) as PropertyDescriptor,
      }),
    {},
  );

  Object.defineProperties(myMoment, properties);
  return myMoment as typeof moment;
}

export default makeMomentByLocale;
