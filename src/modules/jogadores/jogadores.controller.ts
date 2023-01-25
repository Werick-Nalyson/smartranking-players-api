import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { Jogador } from './interface/jogador.interface';
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
  async capturarTodos(
    @Query('email') email: string,
  ): Promise<Jogador[] | Jogador> {
    if (email) {
      return this.jogadoresService.capturarPorEmail(email);
    } else {
      const jogador = await this.jogadoresService.capturarTodos();

      return jogador;
    }
  }

  @Delete(':id')
  async deletarJogador(@Param('id') id: string): Promise<Jogador[] | Jogador> {
    await this.jogadoresService.deletarJogador(id);

    return;
  }
}
