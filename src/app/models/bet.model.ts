export interface IBetItem {
  name: string;
  win: number;
  description: string;
  logoPath: string;
}
export interface IBet {
  id: number;
  teams: IBetItem[];
  draw: number;
}
