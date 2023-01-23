import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private jogadoresService: JogadoresService) {}

  @Post()
  async criarAtualizarJogador(
    @Body() jogadorDto: CriarJogadorDto,
  ): Promise<any> {
    const jogador = await this.jogadoresService.criarAtualizarJogador(
      jogadorDto,
    );

    return jogador;
  }

  @Get()
  async capturarTodos(): Promise<any> {
    const jogador = await this.jogadoresService.capturarTodos();

    return jogador;
  }
}
