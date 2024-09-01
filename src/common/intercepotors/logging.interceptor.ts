import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const methodName = request.route.path; // Method name or route path
    const params = request.params;
    const query = request.query;
    const body = request.body;

    const now = Date.now();
    this.logger.log(
      `${methodName} started with parameters: ${JSON.stringify({ params, query, body })}`,
    );

    return next.handle().pipe(
      tap(
        (data) =>
          this.logger.log(
            `${methodName} finished with return value: ${JSON.stringify(data)} executed in ${Date.now() - now} ms`,
          ),
        (error) =>
          this.logger.error(
            `${methodName} failed with exception message: ${error.message}`,
          ),
      ),
    );
  }
}
