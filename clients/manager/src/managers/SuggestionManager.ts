import { delayFor } from '@packages/utils';
import { eachSeries } from 'async';
import { Message } from 'discord.js';

import BaseManager from './BaseManager';

class SuggestionManager extends BaseManager {
  protected init(): void {
    this.client.on('message', this.onMessage.bind(this));
  }

  private async onMessage(message: Message): Promise<void> {
    const { guild } = message;

    if (!guild || message.author.bot || /^>/.test(message.content)) {
      return;
    }

    const {
      active: suggestionActive,
      channel: suggestionChannel,
    } = await this.database.guilds
      .findOne(guild.id)
      .then(({ suggestion }) => suggestion);

    if (!suggestionActive || message.channel.id !== suggestionChannel) {
      return;
    }

    await eachSeries(
      [
        () => message.react('kaelcerto:724491894343860314'),
        () => delayFor(1000),
        () => message.react('kaelerrado:724491894368895086'),
      ],
      async run => run(),
    ).catch(() => {
      // void
    });
  }
}

export default SuggestionManager;
