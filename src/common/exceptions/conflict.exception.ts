import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class ConflictException extends CustomException {
  constructor(message: string, detail?: any) {
    super(message, HttpStatus.CONFLICT, detail);
  }
}
