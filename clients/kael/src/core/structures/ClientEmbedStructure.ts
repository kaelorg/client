import { Images, Colors } from '@kaelbot/constants';
import { User, MessageEmbed, MessageEmbedOptions } from 'discord.js';

const urlRegex = /^https?:\/\//;

class ClientEmbedStructure extends MessageEmbed {
  constructor(options: MessageEmbedOptions = {}) {
    super(options);

    this.setTimestamp();
    this.setColor(Colors.Favorite);
  }

  public error() {
    this.setColor(Colors.Error);
    return this;
  }

  public setUser(user: User): this {
    this.setFooter(user.username, user.displayAvatarURL());
    return this;
  }

  public setThumbnail(url: string) {
    let parsedUrl = url;

    if (!urlRegex.test(parsedUrl) && typeof parsedUrl === 'string') {
      const gettedUrl = parsedUrl
        .split(/\./g)
        .reduce((images = {} as typeof Images, key) => images[key], Images);

      if (typeof gettedUrl === 'string') {
        parsedUrl = gettedUrl;
      }
    }

    super.setThumbnail(parsedUrl);
    return this;
  }
}

export default ClientEmbedStructure;
