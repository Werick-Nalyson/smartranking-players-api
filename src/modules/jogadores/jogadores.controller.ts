import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { Jogador } from './interface/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
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
  async deletarJogador(@Param('id') id: string): Promise<any> {
    await this.jogadoresService.deletarJogador(id);

    return;
  }
}
