import { names, images } from './data';

export function getProfile(player: Player): PlayerProfile {
  const { kills, deaths, rank: perRank, hasPremium: premium } = player;

  const rank = perRank - 1;
  const rankNames = names.concat(`Legend ${rank - 29}`);
  const rankImages = premium ? images.premium : images.default;

  return {
    rankName: rankNames[rank > 30 ? 30 : rank],
    rankImage: rankImages[rank > 30 ? 30 : rank],
    kd: String(deaths === 0 ? kills / deaths : (kills / deaths).toFixed(2)),
  };
}

interface Player {
  rank: number;
  kills: number;
  deaths: number;
  hasPremium: boolean;
}

interface PlayerProfile {
  kd: string;
  rankName: string;
  rankImage: string;
}
