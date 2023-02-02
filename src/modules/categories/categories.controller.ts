import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategorieDto } from './dto/createCategorie.dto';
import { UpdateCategorieDto } from './dto/updateCategorie.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCategorieDto: CreateCategorieDto) {
    return this.categoriesService.create(createCategorieDto);
  }

  @Get()
  async getAll() {
    return this.categoriesService.getAll();
  }

  @Patch(':categorie')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() updateCategorieDto: UpdateCategorieDto,
    @Param('categorie') categorie: string,
  ) {
    return this.categoriesService.update(categorie, updateCategorieDto);
  }
}
