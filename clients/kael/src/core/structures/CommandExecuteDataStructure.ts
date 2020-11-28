import { GuildDocument, DocumentResponse } from '@kaelbot/database';
import { Message, User, Guild, GuildMember } from 'discord.js';
import { TFunction } from 'i18next';
import moment from 'moment';

import I18nextAdapter from '@core/adapters/I18nextAdapter';

import makeMomentByLocale from '@utils/moment/makeMomentByLocale';

import {
  ChannelExtended,
  CommandExecuteDataStructure as ICommandExecuteDataStructure,
} from '@interfaces';

class CommandExecuteDataStructure implements ICommandExecuteDataStructure {
  public readonly t: TFunction;

  public readonly m: typeof moment;

  public readonly args: string[];

  public readonly document: DocumentResponse<GuildDocument>;

  public readonly author: User;

  public readonly guild: Guild;

  public readonly member: GuildMember;

  public readonly message: Message;

  public readonly channel: ChannelExtended;

  constructor({ args, document, message }: Data) {
    const i18next = new I18nextAdapter();

    this.t = i18next.getFixedT(document.language);
    this.m = makeMomentByLocale(document.language);

    this.args = args;
    this.document = document;

    this.author = message.author;

    this.guild = message.guild as Guild;
    this.member = message.member as GuildMember;

    this.message = message;
    this.channel = message.channel as ChannelExtended;
  }
}

interface Data {
  args: string[];
  message: Message;
  document: DocumentResponse<GuildDocument>;
}

export default CommandExecuteDataStructure;
