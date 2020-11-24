import { Images } from '@kaelbot/constants';
import { UserSocial } from '@kaelbot/database';
import { createCanvas, loadImage, AppliedRenderingContext2D } from 'canvas';
import { User } from 'discord.js';

import { UserBadges } from '@interfaces/dtos/services/user';

import { Align } from '../config';
import measureText from '../utils/measureText';

const WIDTH = 800;
const HEIGHT = 600;
const mainSpace = 10;

const barSize = 110;
const pointsX = 670;

const usernameY = 262;

const avatarX = 10;
const avatarY = 160;
const avatarSize = 170;
const avatarBorder = 10;

const avatarFullSize = avatarSize + avatarBorder + avatarX;
const usernameX = avatarFullSize + mainSpace * 2;
const usernameFullContainer = 612 - (avatarFullSize + mainSpace * 5);

async function profile(
  { language, user }: Dependencies,
  {
    badges,
    background,
    biography,
    charisma,
    reputation,
    perfection,
    intelligence,
    favorite_color: favoriteColor,
  }: Data,
) {
  const profileCanvas = createCanvas(WIDTH, HEIGHT);
  const ctx = profileCanvas.getContext('2d') as AppliedRenderingContext2D;

  const [backgroundImage, avatarImage, templateImage] = await Promise.all([
    loadImage(background),
    loadImage(
      user.displayAvatarURL({ format: 'png', size: 128, dynamic: false }),
    ),
    loadImage(
      Images.BackgroundSources[language] || Images.BackgroundSources['pt-BR'],
    ),
  ]);

  ctx.font = 'bold "Poppins" 24pt sans-serif';

  const allRolesBadgesWidth = badges.roles.reduce(
    (all, [, width], i) => all + width + (i > 0 ? mainSpace : 0),
    0,
  );

  const username = `${user.username.substr(0, 15)}${
    user.username.length > 15 ? '...' : ''
  }#${user.discriminator}`;

  const usernameRemainingContainer =
    usernameFullContainer - allRolesBadgesWidth;

  const usernameMeasured = measureText(ctx, username);
  const usernameMaxWidth = Math.min(
    usernameMeasured.width,
    usernameRemainingContainer,
  );

  const parsedRolesBadges = badges.roles.reduce(
    (all, [source, width, height]) => {
      /* eslint-disable no-param-reassign */
      all.badges.push({
        width,
        height,
        source,
        x: all.inX + mainSpace,
      });

      all.inX += width + mainSpace;
      all.maxX = all.inX + mainSpace * 2;

      return all;
    },
    {
      badges: [] as ParsedRoleBadge[],
      inX: usernameX + usernameMaxWidth,
      maxX: usernameX + usernameMaxWidth + mainSpace * 2,
    },
  );

  // Draw user background image
  ctx.drawImage(backgroundImage, 0, 23, 635, 270);

  // Draw username container background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.roundRect(
    usernameX - mainSpace,
    usernameY - usernameMeasured.height - (275 - usernameY),
    parsedRolesBadges.maxX - usernameX,
    100,
    20,
    true,
    false,
  );

  // Draw template image
  ctx.drawImage(templateImage, 0, 0, WIDTH, HEIGHT);

  // Draw user avatar
  ctx.fillStyle = '#f23859';
  ctx.roundFill(
    avatarX,
    avatarY,
    avatarSize + avatarBorder,
    avatarSize + avatarBorder,
  );
  ctx.roundImage(
    avatarImage,
    avatarX + avatarBorder / 2,
    avatarY + avatarBorder / 2,
    avatarSize,
    avatarSize,
  );

  // Write username
  ctx.font = 'bold "Poppins" 24pt sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(username, usernameX, usernameY, usernameRemainingContainer);

  //
  ctx.font = '22px "Roboto"';

  // Write user description
  ctx.fillStyle = favoriteColor;
  ctx.printAt(biography, 40, 410, 22, 205);

  // POINTS ----

  ctx.fillStyle = '#eb798d';

  // Draw user reputations
  const reputationMeasured = measureText(ctx, reputation);
  ctx.write(
    reputation,
    pointsX + (barSize - reputationMeasured.width) * 0.5,
    260,
    Align.CenterLeft,
  );

  // Draw user perfections
  const perfectionMeasured = measureText(ctx, perfection);
  ctx.write(
    perfection,
    pointsX + (barSize - perfectionMeasured.width) * 0.5,
    316,
    Align.CenterLeft,
  );

  // Draw user charismas
  const charismaMeasured = measureText(ctx, charisma);
  ctx.write(
    charisma,
    pointsX + (barSize - charismaMeasured.width) * 0.5,
    370,
    Align.CenterLeft,
  );

  // Draw user intelligences
  const intelligenceMeasured = measureText(ctx, intelligence);
  ctx.write(
    intelligence,
    pointsX + (barSize - intelligenceMeasured.width) * 0.5,
    428,
    Align.CenterLeft,
  );

  // Draw user badges
  await Promise.all(
    parsedRolesBadges.badges.map(async ({ width, height, source, x }) => {
      const badge = await loadImage(source);

      ctx.drawImage(
        badge,
        x,
        usernameY - (usernameMeasured.height + height) * 0.5,
        width,
        height,
      );
    }),
  );

  // ----

  return profileCanvas.toBuffer();
}

interface Data
  extends Pick<
    UserSocial,
    | 'background'
    | 'biography'
    | 'charisma'
    | 'reputation'
    | 'perfection'
    | 'intelligence'
    | 'favorite_color'
  > {
  badges: UserBadges;
}

interface ParsedRoleBadge {
  x: number;
  width: number;
  height: number;
  source: string;
}

interface Dependencies {
  user: User;
  language: string;
}

export default profile;
