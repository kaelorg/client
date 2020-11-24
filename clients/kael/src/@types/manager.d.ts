declare module '@clients/manager/build/helpers/CountHelper' {
  import { CountModels } from '@kaelbot/constants';

  class CountHelper {
    ['constructor']: typeof CountHelper;

    handle(
      { text, model: getModel }: Handledata,
      { guild, channel }: HandleDeps,
    ): Promise<void>;

    static getModels(getPremium?: boolean): Model[];

    static findModel(
      model: AcceptedModelTypes,
      getPremium?: boolean,
    ): Model | undefined;
  }

  declare type Model = typeof CountModels.Normal[number];
  declare type AcceptedModelTypes = ValueOf<
    Pick<Model, 'id' | 'name' | 'emojis'>
  >;

  interface Handledata {
    text: string;
    model: AcceptedModelTypes;
  }

  interface HandleDeps {
    guild: Guild;
    channel: Channel;
  }

  export default CountHelper;
}
