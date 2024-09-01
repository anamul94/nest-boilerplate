import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class ControllerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ControllerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const methodName = context.getHandler().name;
    const className = context.getClass().name;
    const startTime = Date.now();

    this.logger.log(
      `${methodName} started with parameters: ${JSON.stringify(request.params)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const executionTime = Date.now() - startTime;
        this.logger.log(
          `${methodName} finished with return value: ${JSON.stringify(data)} \t executed in ${executionTime}ms`,
        );
      }),
      catchError((error) => {
        const executionTime = Date.now() - startTime;
        this.logger.error(
          `${methodName} failed with exception message: ${error.message} \t executed in ${executionTime}ms`,
        );
        return throwError(() => error);
      }),
    );
  }
}
