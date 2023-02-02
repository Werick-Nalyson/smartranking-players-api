import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategorieDto } from './dto/createCategorie.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCategorieDto: CreateCategorieDto) {
    return this.categoriesService.create(createCategorieDto);
  }
}
