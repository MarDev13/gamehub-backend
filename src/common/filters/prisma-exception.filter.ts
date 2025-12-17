import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';


import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch(
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';


        if (exception instanceof PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2002':
                    status = HttpStatus.CONFLICT;
                    message = 'El recurso ya existe';
                    break;

                case 'P2025':
                    status = HttpStatus.NOT_FOUND;
                    message = 'Recurso no encontrado';
                    break;

                default:
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Error de base de datos';
                    break;
            }
        }


        if (exception instanceof PrismaClientValidationError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Datos inválidos';
        }

        response.status(status).json({
            statusCode: status,
            error: HttpStatus[status],
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
