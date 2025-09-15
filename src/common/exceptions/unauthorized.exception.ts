import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class UnauthorizedException extends CustomException {
  constructor(message: string = 'Unauthorized access', detail?: any) {
    super(message, HttpStatus.UNAUTHORIZED, detail);
  }
}
