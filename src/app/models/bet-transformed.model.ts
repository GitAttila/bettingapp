import { IBetItem } from './bet.model';

export interface ITransformedBet {
  id: number;
  match: string;
  draw: number;
  home: number;
  away: number;
  teams: IBetItem[];
  updated: {
    draw: boolean;
    home: boolean;
    away: boolean;
  };
}
