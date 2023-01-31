import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { Jogador } from './interface/jogador.interface';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dto/atualizar.jogador.dto';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(data: CriarJogadorDto): Promise<Jogador> {
    const jogadorExiste = await this.jogadorModel
      .findOne({
        email: data.email,
      })
      .exec();

    if (jogadorExiste) {
      throw new BadRequestException('E-mail ou telefone já cadastrado');
    }

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

  async atualizarJogador(
    id: string,
    data: AtualizarJogadorDto,
  ): Promise<Jogador> {
    const jogadorExiste = await this.capturarPeloId(id).catch(() => {
      return {} as Jogador;
    });

    if (!jogadorExiste?._id)
      throw new NotFoundException('Jogador não encontrado');

    jogadorExiste.nome = data.nome;

    await jogadorExiste.save();

    this.logger.log(
      `atualizar jogador ${jogadorExiste._id}: ${JSON.stringify(
        data,
        null,
        2,
      )}`,
    );

    return jogadorExiste;
  }

  async capturarTodos(): Promise<Jogador[]> {
    return this.jogadorModel.find();
  }

  async capturarPeloId(id: string): Promise<Jogador> {
    const jogador = await this.jogadorModel
      .findOne({
        _id: id,
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

    await this.jogadorModel
      .deleteOne({
        _id: id,
      })
      .exec();

    return;
  }
}
