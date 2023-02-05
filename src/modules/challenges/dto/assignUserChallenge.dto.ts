import { IsNotEmpty } from 'class-validator';
import { Result } from '../interface/challenge.interface';
import { Player } from '../../players/interface/player.interface';

export class AssignUserChallengeDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
