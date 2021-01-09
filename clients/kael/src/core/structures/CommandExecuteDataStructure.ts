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
  public readonly args: string[];

  public readonly document: DocumentResponse<GuildDocument>;

  public readonly message: Message;

  constructor({ args, document, message }: Data) {
    this.args = args;
    this.message = message;
    this.document = document;
  }

  get t(): TFunction {
    return new I18nextAdapter().getFixedT(this.document.language);
  }

  get m(): typeof moment {
    return makeMomentByLocale(this.document.language);
  }

  get author(): User {
    return this.message.author;
  }

  get guild(): Guild {
    return <Guild>this.message.guild;
  }

  get member(): GuildMember {
    return <GuildMember>this.message.member;
  }

  get channel(): ChannelExtended {
    return <ChannelExtended>this.message.channel;
  }
}

interface Data {
  args: string[];
  message: Message;
  document: DocumentResponse<GuildDocument>;
}

export default CommandExecuteDataStructure;
