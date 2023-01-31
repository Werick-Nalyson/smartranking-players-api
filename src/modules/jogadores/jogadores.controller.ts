import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AtualizarJogadorDto } from './dto/atualizar.jogador.dto';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { Jogador } from './interface/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() jogadorDto: CriarJogadorDto): Promise<any> {
    const jogador = await this.jogadoresService.criarJogador(jogadorDto);

    return jogador;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() jogadorDto: AtualizarJogadorDto,
    @Param('id') id: string,
  ): Promise<any> {
    const jogador = await this.jogadoresService.atualizarJogador(
      id,
      jogadorDto,
    );

    return jogador;
  }

  @Get()
  async capturarTodos(): Promise<Jogador[]> {
    const jogadores = await this.jogadoresService.capturarTodos();

    return jogadores;
  }

  @Get(':id')
  async capturarPeloId(@Param('id') id: string): Promise<Jogador> {
    return this.jogadoresService.capturarPeloId(id);
  }

  @Delete(':id')
  async deletarJogador(@Param('id') id: string): Promise<any> {
    await this.jogadoresService.deletarJogador(id);

    return;
  }
}
