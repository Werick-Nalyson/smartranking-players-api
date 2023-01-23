import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { Jogador } from './interface/jogador.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(data: CriarJogadorDto): Promise<Jogador> {
    const jogadorExiste = await this.capturarPorEmail(data.email);

    if (!jogadorExiste) {
      return this.criarJogador(data);
    } else {
      return this.atualizarJogador(jogadorExiste, data);
    }
  }

  private async criarJogador(data: CriarJogadorDto): Promise<Jogador> {
    const jogador: Jogador = {
      _id: uuidV4(),
      nome: data.nome,
      email: data.email,
      ranking: 'A',
      posicaoRanking: 0,
      urlFotoJogador: '',
      telefoneCelular: data.telefoneCelular,
    };

    this.jogadores.push(jogador);

    this.logger.log(`criar jogador: ${JSON.stringify(data, null, 2)}`);

    return jogador;
  }

  private async atualizarJogador(
    jogador: Jogador,
    data: CriarJogadorDto,
  ): Promise<Jogador> {
    jogador.nome = data.nome;

    this.logger.log(`atualizar jogador: ${JSON.stringify(data, null, 2)}`);

    return jogador;
  }

  async capturarTodos(): Promise<Jogador[]> {
    return this.jogadores;
  }

  private async capturarPorEmail(email: string): Promise<Jogador> {
    const jogador = this.jogadores.find((jogador) => jogador.email === email);

    return jogador;
  }
}
