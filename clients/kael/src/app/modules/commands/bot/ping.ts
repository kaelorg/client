import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'ping',
  category: 'bot',
})
class PingCommand extends CommandStructure {
  public execute({ t, message, channel }: CommandExecuteData) {
    channel.send(
      t<string>('commands:ping.ping', {
        response: Math.trunc(Math.abs(Date.now() - message.createdTimestamp)),
      }),
    );
  }
}

export default PingCommand;
