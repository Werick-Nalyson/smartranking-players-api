import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Query,
  Param,
  Delete,
  Logger,
  Patch,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { Challenge } from './interface/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipe/ChallengeStatusValidation.pipe';
import { AssignUserChallengeDto } from './dto/assignUserChallenge.dto';
import { UpdateChallengeDto } from './dto/updateChallenge.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`,
    );
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  async getAll(@Query('playerId') playerId: string): Promise<Array<Challenge>> {
    return playerId
      ? this.challengesService.getChallengesPlayer(playerId)
      : this.challengesService.getAll();
  }

  @Patch(':id')
  async update(
    @Body(ChallengeStatusValidationPipe)
    updateChallengeDto: UpdateChallengeDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.challengesService.update(id, updateChallengeDto);
  }

  @Post(':id/match')
  async assignChallengeMatch(
    @Body(ValidationPipe)
    assignChallengeMatchDto: AssignUserChallengeDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.challengesService.assignChallengeMatch(
      id,
      assignChallengeMatchDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.challengesService.remove(id);
    return;
  }
}
