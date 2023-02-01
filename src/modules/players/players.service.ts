import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { Player } from './interface/player.interface';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async create(data: CreatePlayerDto): Promise<Player> {
    const playerExists = await this.playerModel
      .findOne({
        email: data.email,
      })
      .exec();

    if (playerExists) {
      throw new BadRequestException('E-mail or telephone has exists');
    }

    const jogadorCriado = new this.playerModel({
      name: data.name,
      email: data.email,
      ranking: 'A',
      rankingPosition: 0,
      urlProfilePlayer: '',
      telephone: data.telephone,
    });

    const player = await jogadorCriado.save();

    this.logger.log(`created player: ${JSON.stringify(data, null, 2)}`);

    return player;
  }

  async update(id: string, data: UpdatePlayerDto): Promise<Player> {
    const playerExists = await this.getById(id).catch(() => {
      return {} as Player;
    });

    if (!playerExists?._id) throw new NotFoundException('Player not found');

    playerExists.name = data.name;

    await playerExists.save();

    this.logger.log(
      `updated player ${playerExists._id}: ${JSON.stringify(data, null, 2)}`,
    );

    return playerExists;
  }

  async getAll(): Promise<Player[]> {
    return this.playerModel.find();
  }

  async getById(id: string): Promise<Player> {
    const player = await this.playerModel
      .findOne({
        _id: id,
      })
      .exec();

    if (!player) throw new NotFoundException('Player not found');

    return player;
  }

  async remove(id: string): Promise<void> {
    const playerExists = await this.playerModel
      .findOne({
        _id: id,
      })
      .exec();

    if (!playerExists) throw new NotFoundException('Player not found');

    await this.playerModel
      .deleteOne({
        _id: id,
      })
      .exec();

    return;
  }
}
