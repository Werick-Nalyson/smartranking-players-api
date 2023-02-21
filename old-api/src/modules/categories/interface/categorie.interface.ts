import { Document } from 'mongoose';
import { Player } from 'src/modules/players/interface/player.interface';

export interface Categorie extends Document {
  readonly categorie: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
