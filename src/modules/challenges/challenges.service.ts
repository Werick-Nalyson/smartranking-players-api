import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, Match } from './interface/challenge.interface';
import { Model } from 'mongoose';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { PlayersService } from '../players/players.service';
import { UpdateChallengeDto } from './dto/updateChallenge.dto';
import { AssignUserChallengeDto } from './dto/assignUserChallenge.dto';
import { ChallengeStatus } from './interface/challengeStatusEnum.interface';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const players = await this.playersService.getAll();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(
          `The id ${playerDto._id} is not a player`,
        );
      }
    });

    const requesterIsPlayerMatch = createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.requester,
    );

    this.logger.log(`requesterIsPlayerMatch: ${requesterIsPlayerMatch}`);

    if (requesterIsPlayerMatch.length == 0) {
      throw new BadRequestException(`The requester must be player in a match`);
    }

    const categoryPlayer = await this.categoriesService.getCategoriePlayer(
      createChallengeDto.requester,
    );

    if (!categoryPlayer) {
      throw new BadRequestException(
        `The requester must be registered in a category`,
      );
    }

    const createdChallenge = new this.challengeModel(createChallengeDto);
    createdChallenge.category = categoryPlayer.categorie;
    createdChallenge.dateHourRequester = new Date();
    createdChallenge.status = ChallengeStatus.PENDING;

    this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`);

    return await createdChallenge.save();
  }

  async getAll(): Promise<Array<Challenge>> {
    return this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async getChallengesPlayer(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.getAll();

    const playerFilter = players.filter((player) => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`The ${_id} is not a player`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async update(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengeExists = await this.challengeModel.findById(_id).exec();

    if (!challengeExists) {
      throw new NotFoundException(`Challenge ${_id} is not registered`);
    }

    if (updateChallengeDto.status) {
      challengeExists.dateHourResponse = new Date();
    }
    challengeExists.status = updateChallengeDto.status;
    challengeExists.dateHourChallenge = updateChallengeDto.dateHourChallenge;

    await challengeExists.save();
  }

  async assignChallengeMatch(
    _id: string,
    assignChallengeMatchDto: AssignUserChallengeDto,
  ): Promise<void> {
    const challengeExists = await this.challengeModel.findById(_id).exec();

    if (!challengeExists) {
      throw new BadRequestException(`Challenge ${_id} is not registered`);
    }

    const playerFilter = challengeExists.players.filter(
      (player) => player._id == assignChallengeMatchDto.def,
    );

    this.logger.log(`challengeExists: ${challengeExists}`);
    this.logger.log(`playerFilter: ${playerFilter}`);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`The winner is not part of the challenge`);
    }

    const createdMatch = new this.matchModel(assignChallengeMatchDto);

    createdMatch.category = challengeExists.category;
    createdMatch.players = challengeExists.players;

    const result = await createdMatch.save();

    challengeExists.status = ChallengeStatus.REALIZED;
    challengeExists.match = result._id;

    try {
      await challengeExists.save();
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async remove(_id: string): Promise<void> {
    const challengeExists = await this.challengeModel.findById(_id).exec();

    if (!challengeExists) {
      throw new BadRequestException(`Challenge ${_id} is not registered`);
    }

    challengeExists.status = ChallengeStatus.CANCELED;

    await challengeExists.save();
  }
}
