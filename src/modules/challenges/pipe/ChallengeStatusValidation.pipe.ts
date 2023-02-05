import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interface/challengeStatusEnum.interface';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly permittedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.REJECTED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} is invalid`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const idx = this.permittedStatus.indexOf(status);
    return idx !== -1;
  }
}
