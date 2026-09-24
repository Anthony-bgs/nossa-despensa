import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class HttpSuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode ?? 200;

        return {
          statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          data:
            data ?? 'Operação realizada com sucesso',
        };
      }),
    );
  }
}
