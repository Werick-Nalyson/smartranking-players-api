import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { Jogador } from './interface/jogador.interface';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarAtualizarJogador(data: CriarJogadorDto): Promise<Jogador> {
    const jogadorExiste = await this.capturarPorEmail(data.email).catch(
      () => false,
    );

    if (!jogadorExiste) {
      return this.criarJogador(data);
    } else {
      return this.atualizarJogador(jogadorExiste as Jogador, data);
    }
  }

  private async criarJogador(data: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel({
      nome: data.nome,
      email: data.email,
      ranking: 'A',
      posicaoRanking: 0,
      urlFotoJogador: '',
      telefoneCelular: data.telefoneCelular,
    });

    const jogador = await jogadorCriado.save();

    this.logger.log(`criar jogador: ${JSON.stringify(data, null, 2)}`);

    return jogador;
  }

  private async atualizarJogador(
    jogador: Jogador,
    data: CriarJogadorDto,
  ): Promise<Jogador> {
    jogador.nome = data.nome;

    await jogador.save();

    this.logger.log(`atualizar jogador: ${JSON.stringify(data, null, 2)}`);

    return jogador;
  }

  async capturarTodos(): Promise<Jogador[]> {
    return this.jogadorModel.find();
  }

  async capturarPorEmail(email: string): Promise<Jogador> {
    const jogador = await this.jogadorModel
      .findOne({
        email,
      })
      .exec();

    if (!jogador) throw new NotFoundException('Jogador não encontrado');

    return jogador;
  }

  async deletarJogador(id: string): Promise<void> {
    const jogadorExiste = await this.jogadorModel
      .findOne({
        _id: id,
      })
      .exec();

    if (!jogadorExiste) throw new NotFoundException('Jogador não encontrado');

    return this.jogadorModel
      .remove({
        _id: id,
      })
      .exec();
  }
}
