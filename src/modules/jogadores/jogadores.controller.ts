import { Controller, Get, Post } from '@nestjs/common';

@Controller('api/v1/jogadores')
export class JogadoresController {
  @Post()
  async criarAtualizarJogador(): Promise<any> {
    return {
      nome: 'Usuario',
    };
  }
}
