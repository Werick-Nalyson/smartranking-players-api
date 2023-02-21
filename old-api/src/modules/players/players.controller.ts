import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { Player } from './interface/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() playerDto: CreatePlayerDto): Promise<any> {
    const player = await this.playersService.create(playerDto);

    return player;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() playerDto: UpdatePlayerDto,
    @Param('id') id: string,
  ): Promise<any> {
    const player = await this.playersService.update(id, playerDto);

    return player;
  }

  @Get()
  async getAll(): Promise<Player[]> {
    const players = await this.playersService.getAll();

    return players;
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Player> {
    return this.playersService.getById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    await this.playersService.remove(id);

    return;
  }
}
