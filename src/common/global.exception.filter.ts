/** npm imports */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common'

import { Request, Response } from 'express'

/** local imports */
import { LoggerService } from 'src/logging/logger.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string | string[] = 'Internal server error'

    // Determine the status and message based on the exception type
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()

      // Handle different types of HttpException responses
      if (typeof res === 'string') {
        message = res
      } else if (typeof res === 'object' && (res as any)['message']) {
        message = Array.isArray((res as any)['message']) ? (res as any)['message'] : [(res as any)['message']]
      }
    } else if (exception instanceof Error) {
      // General JavaScript error
      message = exception.message
    }

    // Log the error for internal monitoring
    this.logger.error(
      Array.isArray(message) ? message.join(', ') : message,
      exception instanceof Error ? exception.stack : undefined,
      {
        path: request.url,
        correlationId: (request as any)['correlationId'],
        userId: (request as any)['userId'],
        method: request.method,
      },
    )

    // Send a standardized JSON response to the client
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: true,
    })
  }
}
