import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { CategoriesModule } from './modules/categories/categories.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { PlayersModule } from './modules/players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
