import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class InternalServerErrorException extends CustomException {
  constructor(message = 'Internal Server Error', details?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}
