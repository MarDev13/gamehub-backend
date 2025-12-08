import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { RoleName } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    @Role('ADMIN')
    @Get('dashboard')
    getdashboard(@Req() req) {
        return {
            message:`Bienvenido al panel de administrador ${req.user.username}`,
        };
    }
}
