import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategorieDto } from './dto/createCategorie.dto';
import { UpdateCategorieDto } from './dto/updateCategorie.dto';
import { Categorie } from './interface/categorie.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categorie') private readonly categorieModel: Model<Categorie>,
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
}
