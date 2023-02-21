import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interface/challengeStatusEnum.interface';

export class UpdateChallengeDto {
  @IsOptional()
  dateHourChallenge: Date;

  @IsOptional()
  status: ChallengeStatus;
}
