import { IsString, IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { Event } from '../interface/categorie.interface';

export class UpdateCategorieDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
