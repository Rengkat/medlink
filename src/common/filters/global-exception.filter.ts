import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomException } from '../exceptions/custom.exception';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  success: false;
  message: string;
  details?: any;
  path: string;
  requestId?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse: Partial<ErrorResponse> = {
      timestamp: new Date().toISOString(),
      success: false,
      path: request.url,
    };

    let status: HttpStatus;
    let message: string;
    let details: any = null;

    if (exception instanceof CustomException) {
      status = exception.getStatus();
      message = exception.message || 'Internal server error';
      details = exception.details;

      this.logger.warn(
        `CustomException: Status ${status} - ${message}`,
        exception.stack,
      );
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message || 'Internal server error';

      const exceptionResponse = exception.getResponse();
      details =
        typeof exceptionResponse === 'object'
          ? exceptionResponse
          : { error: exceptionResponse };

      this.logger.warn(
        `HttpException: Status ${status} - ${message}`,
        exception.stack,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';

      // Log full error for debugging
      this.logger.error(
        `Unhandled Exception: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        exception instanceof Error ? exception.stack : exception,
      );

      // Sanitize response in production
      if (process.env.NODE_ENV === 'production') {
        message = 'Internal server error';
        details = null; // Don't expose internal error details
      } else {
        details = {
          error:
            exception instanceof Error ? exception.message : 'Unknown error',
          type: exception?.constructor?.name || 'Unknown',
        };
      }
    }

    // Construct final response
    const finalResponse: ErrorResponse = {
      statusCode: status,
      timestamp: errorResponse.timestamp!,
      success: false,
      message,
      path: errorResponse.path!,
      ...(details && { details }),
    };

    response.status(status).json(finalResponse);
  }
}
