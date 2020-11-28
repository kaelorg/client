import moment, {
  localeData,
  Locale,
  Moment,
  MomentInput,
  MomentFormatSpecification,
} from 'moment';

import config from './config';
import isValidLocale from './isValidLocale';

function makeMomentByLocale(locale?: string): typeof moment {
  const myMoment = (
    inp?: MomentInput,
    format?: MomentFormatSpecification,
    language?: string,
    strict?: boolean,
  ): Moment => {
    let myLocale: Locale = localeData(config.defaultLocale);
    const momentGenerated = moment(inp, format, language, strict);

    if (locale && isValidLocale(locale)) {
      myLocale = localeData(locale);
    }

    momentGenerated.locale(myLocale._abbr);
    return momentGenerated;
  };

  return myMoment as typeof moment;
}

export default makeMomentByLocale;
