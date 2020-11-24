import i18next, { TFunction } from 'i18next';
import i18nextBackend from 'i18next-fs-backend';

import i18nextConfig from '@config/i18next';

class I18nextAdapter {
  public readonly languages: string[] = [];

  private readonly i18n = I18nextAdapter.i18n;

  private static readonly i18n = i18next.use(i18nextBackend);

  get t(): TFunction {
    return this.getFixedT(i18nextConfig.defaultLanguage);
  }

  public getFixedT(language: string): TFunction {
    return this.i18n.getFixedT(language);
  }

  public setLanguages(languages: string[]): this {
    this.languages.push(...languages);
    return this;
  }

  // Static

  public static async init(): Promise<I18nextAdapter> {
    await this.i18n.init(i18nextConfig);
    return new I18nextAdapter();
  }
}

export default I18nextAdapter;
