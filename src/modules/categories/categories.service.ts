import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategorieDto } from './dto/createCategorie.dto';
import { Categorie } from './interface/categorie.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categorie') private readonly categorieModel: Model<Categorie>,
  ) {}

  async create(createCategorieDto: CreateCategorieDto): Promise<Categorie> {
    const { categorie, description, events } = createCategorieDto;

    const categoriaEncotrada = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (categoriaEncotrada) {
      throw new BadRequestException(`Categorie ${categorie} already exists!`);
    }

    const categoriaCriada = new this.categorieModel({
      categorie,
      description,
      events,
    });

    return await categoriaCriada.save();
  }
}
