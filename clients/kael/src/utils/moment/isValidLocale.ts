import { localeData } from 'moment';

function isValidLocale(locale: string): boolean {
  const { _abbr: abbr } = localeData(locale);

  return abbr === locale.toLowerCase();
}

export default isValidLocale;
