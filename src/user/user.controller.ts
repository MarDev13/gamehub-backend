import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    @Get('profile')
    getProfile(@Req() req) {
        return {
            message: `Bienvenido al perfil de usuario, ${req.user.username}`,
        };
    }
}
