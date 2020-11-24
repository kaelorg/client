import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'models',
  category: 'system',
  reference: 'count',
  aliases: ['modelos'],
})
class ModelsCountCommand extends CommandStructure {
  public execute({ t, author, channel, guild }: CommandExecuteData) {
    channel.send(
      this.embed(author)
        .setThumbnail('Kael.Count')
        .setAuthor(
          t('commands:count.models.author'),
          guild.iconURL() || undefined,
        )
        .addField(
          t('commands:count:models.default'),
          `
      <:P0:509041031199588377> - **ID** 0
      <:B0:509041031183073320> - **ID** 1
      <:C0:509041030985809980> - **ID** 2
      <:k0:512818665142353920> - **ID** 3
      <:VO0:509036054653960192> - **ID** 4
      <:AZ0:509036054247112724> - **ID** 5
      <:VE0:509036054246981632> - **ID** 6
      <:RX0:509036054242656256> - **ID** 7
      <:RS0:509036054276341771> - **ID** 8
        `,
          true,
        )
        .addField(
          t('commands:count:models:animate'),
          `
      <a:PLAZ0:532070609966858240> - **ID** 9
      <a:PLL0:532070608725344256> - **ID** 10
      <a:PLVE0:532070609904205854> - **ID** 11
      <a:PLRX0:532070608868212756> - **ID** 12
      <a:LTAZ0:532788061084450827> - **ID** 13
      <a:LTL0:532788063395512322> - **ID** 14
      <a:LTVE0:532788062824955914> - **ID** 15
      <a:LTRX0:532788063840108566> - **ID** 16
        `,
          true,
        )
        .addField(
          t('commands:count:models:animate2'),
          `
      <a:CBAZ0:531733395756023809> - **ID** 17
      <a:CBL0:531733395898892308> - **ID** 18
      <a:CBVE0:531733399824498689> - **ID** 19
      <a:CBRX0:531733400244191242> - **ID** 20
      <a:MAZ0:533529498344357888> - **ID** 21
      <a:ML0:533529498465992724> - **ID** 22
      <a:MVE0:533529508930912277> - **ID** 23
      <a:MRX0:533529511564673024> - **ID** 24
        `,
          true,
        )
        .addField(
          t('commands:count:models:special'),
          `
      <a:MT0:561279068440494080> - **ID** 25
      <a:KC0:561061682080907267> - **ID** 26
      <a:J0:572514885947359245> - **ID** 27
      <a:D0:556295094974808066> - **ID** 28
      <a:CN19K0:654384385830944768> - **ID** 29
        `,
          true,
        )
        .addField(
          t('commands:count:models:partners'),
          `
          <:NESCORD0:728714489024741386> - **ID** 001
          `,
          true,
        ),
    );
  }
}

export default ModelsCountCommand;
