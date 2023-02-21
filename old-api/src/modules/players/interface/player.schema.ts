import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    telephone: { type: String },
    name: String,
    ranking: String,
    rankingPosition: Number,
    urlProfilePlayer: String,
  },
  { timestamps: true, collection: 'players' },
);
