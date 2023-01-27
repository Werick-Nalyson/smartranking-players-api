import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { JogadoresModule } from './modules/jogadores/jogadores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    JogadoresModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
