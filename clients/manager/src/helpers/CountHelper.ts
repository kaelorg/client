import { CountModels } from '@kaelbot/constants';
import { delayFor } from '@packages/utils';
import { Guild, GuildChannel } from 'discord.js';

class CountHelper {
  ['constructor']: typeof CountHelper;

  public async handle(
    { text, model: getModel }: Handledata,
    { guild, channel }: HandleDeps,
  ) {
    const model = CountHelper.findModel(getModel);

    if (!model || channel.type !== 'text') {
      return;
    }

    const emojisGuild = guild.client.guilds.cache.get(model.guildId);
    const count = guild.memberCount
      .toString()
      .split('')
      .filter(number => /^([0-9])$/.test(number))
      .map(number => {
        let emoji = number;

        if (emojisGuild) {
          const emojiFinded = emojisGuild.emojis.cache.find(
            ({ name }) => name === `${model.emojis}${number}`,
          );

          if (emojiFinded) {
            emoji = emojiFinded.toString();
          }
        }

        return emoji;
      })
      .join('');

    try {
      await delayFor(2000);
      await channel.edit({ topic: text.replace(/\[kael\]/g, count) });
    } catch {
      // Silent
    }
  }

  // Static

  public static getModels(getPremium = true): Model[] {
    const models = CountModels.Normal;

    if (getPremium) {
      models.push(...CountModels.Premium);
    }

    return models;
  }

  public static findModel(
    model: AcceptedModelTypes,
    getPremium = true,
  ): Model | undefined {
    return this.getModels(getPremium).find(
      ({ id, name, emojis }) =>
        name === model || emojis === model || id === Number(model),
    );
  }
}

type Model = typeof CountModels.Normal[number];

type AcceptedModelTypes = ValueOf<Pick<Model, 'id' | 'name' | 'emojis'>>;

interface Handledata {
  text: string;
  model: AcceptedModelTypes;
}

interface HandleDeps {
  guild: Guild;
  channel: GuildChannel;
}

export default CountHelper;
