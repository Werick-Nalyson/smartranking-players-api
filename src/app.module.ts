import { Module } from '@nestjs/common';
import { JogadoresModule } from './modules/jogadores/jogadores.module';

@Module({
  imports: [JogadoresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
