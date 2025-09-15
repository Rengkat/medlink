import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    public detsils?: any,
  ) {
    super(message, status);
    this.detsils = detsils;
  }
}
