import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class BadRequestException extends CustomException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, details);
  }
}
