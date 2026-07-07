import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    let message = 'An unexpected system error occurred.';
    let error = 'Internal Server Error';

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const respObj = exceptionResponse as Record<string, unknown>;
      message = (respObj.message as string) || message;
      error = (respObj.error as string) || error;
    } else if (exceptionResponse && typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const requestId = request['requestId'] || 'unknown';

    // Structured JSON error log
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      type: 'EXCEPTION',
      requestId,
      statusCode: status,
      path: request.url,
      message,
      error,
      stack: exception instanceof Error ? exception.stack : undefined,
    }));

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      error,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
