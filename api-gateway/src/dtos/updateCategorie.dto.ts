import { IsString, IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { Event } from './createCategorie.dto';

export class UpdateCategorieDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
