import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class ForbiddenException extends CustomException {
  constructor(message = 'Access forbidden', details?: any) {
    super(message, HttpStatus.FORBIDDEN, details);
  }
}
