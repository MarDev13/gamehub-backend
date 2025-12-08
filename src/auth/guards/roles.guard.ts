import {
    CanActivate,
    Injectable,
    ForbiddenException,
    ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );


        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('No se pudo obtener el usuario del token');
        }

        if (!user.role) {
            throw new ForbiddenException('El token no contiene información de rol');
        }
        const userRole = user.role;
        const hasPermission = requiredRoles.includes(userRole);


        if (!hasPermission) {
            throw new ForbiddenException('No tienes permisos para acceder a esta ruta');
        }
        return true;
    }
}
