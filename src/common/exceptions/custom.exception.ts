import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    public details?: any,
  ) {
    super(message, status);
    this.details = details;
  }
}
