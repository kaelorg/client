import { readdirSync } from 'fs';
import { InitOptions } from 'i18next';
import { join, resolve } from 'path';

const defaultLanguage = 'pt-BR';
const localizationPath = resolve(__dirname, '..', 'app', 'localization');

const languages = readdirSync(localizationPath);
const files = readdirSync(join(localizationPath, defaultLanguage));

const config: InitOptions & MyConfig = {
  defaultLanguage,
  preload: languages,
  returnEmptyString: false,
  fallbackLng: defaultLanguage,
  ns: files.map(file => file.replace(/\.json/, '')),
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: `${localizationPath}/{{lng}}/{{ns}}.json`,
  },
};

interface MyConfig {
  defaultLanguage: string;
}

export default config;
