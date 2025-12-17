import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        
        const exceptionResponse = exception.getResponse();
        const message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || 'Unexpected error';

        response.status(status).json({
            statusCode: status,
            error: HttpStatus[status],
            message,
            path: request.url,
            timestamp: new Date().toISOString()
        });
    }
}