import { Document } from 'mongoose';

export interface Player extends Document {
  readonly telephone: string;
  readonly email: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  urlProfilePlayer: string;
}
