import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from '../players/players.service';
import { CreateCategorieDto } from './dto/createCategorie.dto';
import { UpdateCategorieDto } from './dto/updateCategorie.dto';
import { Categorie } from './interface/categorie.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categorie') private readonly categorieModel: Model<Categorie>,
    private readonly playersService: PlayersService,
  ) {}

  async create(createCategorieDto: CreateCategorieDto): Promise<Categorie> {
    const { categorie, description, events } = createCategorieDto;

    const categorieExists = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (categorieExists) {
      throw new BadRequestException(`Categorie ${categorie} already exists`);
    }

    const createdCategorie = new this.categorieModel({
      categorie,
      description,
      events,
    });

    return await createdCategorie.save();
  }

  async getAll() {
    return this.categorieModel.find().populate('players').exec();
  }

  async getById(id: string) {
    const categorie = await this.categorieModel
      .findOne({
        _id: id,
      })
      .exec();

    if (!categorie) throw new NotFoundException('Categorie not found');

    return categorie;
  }

  async update(
    categorie: string,
    updateCategorieDto: UpdateCategorieDto,
  ): Promise<Categorie> {
    const { description, events } = updateCategorieDto;

    const categorieExists = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (!categorieExists) {
      throw new NotFoundException(`Categorie ${categorie} not found`);
    }

    categorieExists.description = description;
    categorieExists.events = events;

    await categorieExists.save();

    return categorieExists;
  }

  async assignCategoriePlayer(params: string[]): Promise<void> {
    const { categorie, playerId } = params as any;

    const categorieExists = await this.categorieModel
      .findOne({ categorie })
      .exec();

    const playerAlreadyExistsCategory = await this.categorieModel
      .find({ categorie })
      .where('players')
      .in(playerId)
      .exec();

    await this.playersService.getById(playerId);

    if (!categorieExists) {
      throw new BadRequestException(`Categorie ${categorie} not found`);
    }

    if (playerAlreadyExistsCategory.length > 0) {
      throw new BadRequestException(
        `Player ${playerId} already exists in Categorie ${categorie}!`,
      );
    }

    categorieExists.players.push(playerId);

    await categorieExists.save();
  }
}
