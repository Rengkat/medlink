import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class NotFoundException extends CustomException {
  constructor(resource: string, detail?: any) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, detail);
  }
}
